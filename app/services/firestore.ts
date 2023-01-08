import Service, { service } from '@ember/service';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, query, QuerySnapshot, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { tracked } from '@glimmer/tracking';
import { action, set } from '@ember/object'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import RouterService from '@ember/routing/router-service'

export type Course = {
  code: string,
  color: number,
  name?: string,
}

export type Task = {
  dueDate: Date,
  courseCode: string,
  courseColor: number,
  type: string,
  name: string,
  weight: number,
  isCompleted: boolean,
  id: string,
}

export type TaskPreValidation = {
  dueDate: Date | null,
  courseCode: string,
  courseColor: number,
  type: string,
  name: string,
  weight: number,
  isCompleted: boolean,
  id?: string
}

export type Schedule = {
  name: string,
  courses: Course[],
  tasks: {[id: string]: Task},
  id: string
}

export type User = {
  email: string,
  displayName: string,
  id: string,
}

export default class FirestoreService extends Service {
    db!: Firestore
    app!: FirebaseApp

    @service router!: RouterService;

    @tracked user!: User
    @tracked schedules: {[id: string]: Schedule} = {};
    @tracked currSchedule?: Schedule;
    @tracked isLoggedIn = false;
    @tracked isAuthSettled = false;

  @action setupApp(): void {
    const firebaseConfig = {
      apiKey: 'AIzaSyAPnRFwuaE09yt95MTR7shtQDlcxiTrr1E',
      authDomain: 'efficient-tasks.firebaseapp.com',
      projectId: 'efficient-tasks',
      storageBucket: 'efficient-tasks.appspot.com',
      messagingSenderId: '1084703353802',
      appId: '1:1084703353802:web:01f78e2f02b706cbf73d33',
      measurementId: 'G-SDMQ7176JF',
    };

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  @action async setupUser(): Promise<void> {
    onAuthStateChanged(getAuth(this.app), user => {
      if (user) {
          const docRef = doc(this.db, 'users', user.uid);
          getDoc(docRef).then(docSnap => {
            if(!docSnap.exists()){
              setDoc(docRef, {name: user.displayName, email: user.email})
                .catch(e => console.log(e));
            }
            this.user = { email: user.email ?? '', displayName: user.displayName ?? '', id: user.uid };
            this.isLoggedIn = true;
            this.isAuthSettled = true;
            this.router.transitionTo('schedules') //TODO: Let user redirect to the url they originally wanted to go to
          });
      } else {
        this.isLoggedIn = false;
        this.isAuthSettled = true;
        this.router.transitionTo('login');
      }
    })
  }

  @action async setupSchedule(id: string): Promise<void> {
    await this.fetchSchedule(id);
    await this.fetchTasks(id);
  }

  @action async fetchSchedules(): Promise<void> {
    if(!this.user) return;
    const colRef = collection(this.db, `users/${this.user.id}/schedules`);
    await getDocs(colRef).then((querySnap: QuerySnapshot) => {
      querySnap.forEach(doc => {
        const data = doc.data();
        this.schedules[doc.id] = {...data, id: doc.id} as Schedule
      });
    });
  }

  @action async fetchSchedule(id: string): Promise<void> {
    if(!this.user) return;
    const docRef = doc(this.db, `users/${this.user.id}/schedules`, id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.currSchedule = {...data, id: id} as Schedule;
      console.log('From fetch schedule', this.currSchedule);
    } else {
      console.log('Failed to retrieve the schedule!');
    }
  }

  @action async fetchTasks(scheduleId: string): Promise<void> {
    if(!this.user || !this.currSchedule) return;
    const tasks: {[id: string]: Task} = {}
    const colRef = collection(this.db, `users/${this.user.id}/schedules/${scheduleId}`, 'tasks');
    await getDocs(colRef).then((querySnap: QuerySnapshot) => {
      querySnap.forEach(doc => {
        const data = doc.data();
        tasks[doc.id] = {...data, dueDate: data['dueDate'].toDate(), id: doc.id} as Task
      });
    });
    this.currSchedule.tasks = tasks;
    console.log('From fetchTasks: ', this.currSchedule.tasks);
  }

  @action async updateScheduleName(newName: string): Promise<void> {
    console.log('Changing schedule name to ', newName)
    if(!this.user || !this.currSchedule || !this.schedules[this.currSchedule.id]) return;
    const docRef = doc(this.db, `users/${this.user.id}/schedules`, this.currSchedule.id);
    await updateDoc(docRef, {name: newName}).catch(e => console.log(e));
    this.currSchedule.name = newName;
    this.schedules[this.currSchedule.id] = this.currSchedule;
  }

  @action async addCourse(newCourse: Course): Promise<void> {
    if (!this.user || !this.currSchedule || !this.schedules[this.currSchedule.id]) return
    const docRef = doc(this.db, `users/${this.user.id}/schedules`, this.currSchedule.id)
    await updateDoc(docRef, {
      courses: arrayUnion(newCourse)
    }).catch(e => console.log(e))
    this.currSchedule.courses.push(newCourse)
    this.schedules[this.currSchedule.id] = this.currSchedule
    this.currSchedule = this.currSchedule
  }

  @action async updateCourse(originalCourse: Course, updatedCourse: Course): Promise<void> {
    if (!this.user || !this.currSchedule || !this.schedules[this.currSchedule.id]) return

    //Remove old course and replace with updated version
    const docRef = doc(this.db, `users/${this.user.id}/schedules`, this.currSchedule.id)
    await updateDoc(docRef, {
      courses: arrayRemove(originalCourse)
    }).catch(e => console.log(e))
    await updateDoc(docRef, {
      courses: arrayUnion(updatedCourse)
    }).catch(e => console.log(e))

    //Update each task
    const tasksRef = collection(this.db, `users/${this.user.id}/schedules/${this.currSchedule.id}/tasks`)
    const taskQuery = query(tasksRef, where('courseCode', '==', originalCourse.code))
    const batch = writeBatch(this.db)
    await getDocs(taskQuery).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        batch.update(doc.ref, {
          courseCode: updatedCourse.code,
          courseColor: updatedCourse.color,
        });
      });
    }).catch(e => console.log(e))
    batch.commit()

    //Update tasks locally
    Object.values(this.currSchedule.tasks).forEach(t => {
      if(t.courseCode === originalCourse.code){
        set(t, 'courseCode', updatedCourse.code)
        set(t, 'courseColor', updatedCourse.color)
      }
    })

    //Update course locally
    let courseToUpdateIndex: number = this.currSchedule.courses.findIndex(c => c.code === originalCourse.code)
    if(courseToUpdateIndex != -1) set(this.currSchedule.courses, courseToUpdateIndex, updatedCourse)
    else console.log('Something went wrong updating the course!')

    this.schedules[this.currSchedule.id] = this.currSchedule
    this.currSchedule = this.currSchedule
  }

  @action async addTask(newTask: TaskPreValidation): Promise<void> {
    if (!this.user || !this.currSchedule) return;
    if(!(newTask.courseCode && newTask.courseColor && newTask.dueDate && newTask.name)){
      console.log('Failed to add task');
      return;
    }
    const colRef = collection(this.db, `users/${this.user.id}/schedules/${this.currSchedule.id}`, 'tasks');
    delete newTask.id;
    const docRef = await addDoc(colRef, newTask);
    this.currSchedule.tasks[docRef.id] = { ...newTask, id: docRef.id } as Task
    this.currSchedule = this.currSchedule;
  }

  @action async updateTask(updatedTask: Task): Promise<void> {
    if (!this.user || !this.currSchedule) return;
    const docRef = doc(this.db, `users/${this.user.id}/schedules/${this.currSchedule.id}/tasks`, updatedTask.id);
    await updateDoc(docRef, updatedTask);

    this.currSchedule.tasks[updatedTask.id] = updatedTask;
    this.currSchedule = this.currSchedule;
    
  }

  @action async completeTask(isCompleted: boolean, id: string){
    if (!this.user || !this.currSchedule) return;
    const docRef = doc(this.db, `users/${this.user.id}/schedules/${this.currSchedule.id}/tasks`, id);
    await updateDoc(docRef, {isCompleted: isCompleted});

    const indexedTask: Task | undefined = this.currSchedule.tasks[id];
    if(indexedTask === undefined) return;
    set(indexedTask, 'isCompleted', isCompleted);  
  }

  @action async deleteCourse(course: Course): Promise<void> {
    if (!this.user || !this.currSchedule) return;
    //Deleting course on firestore
    const scheduleDocRef = doc(this.db, `users/${this.user.id}/schedules/`, this.currSchedule.id);
    await updateDoc(scheduleDocRef, {courses: arrayRemove(course)});
    const taskColRef = collection(this.db, `users/${this.user.id}/schedules/${this.currSchedule.id}/tasks`);
    await getDocs(taskColRef).then(querySnap => {
      querySnap.forEach(doc => {
        const docsCourseCode: string = doc.data()['courseCode'];
        if (docsCourseCode === course.code) deleteDoc(doc.ref);
      })
    })

    //Deleting course locally
    this.currSchedule.courses = this.currSchedule.courses.filter(c => c.code !== course.code);
    Object.values(this.currSchedule.tasks).forEach(t => {
      if (t.courseCode === course.code && this.currSchedule) delete this.currSchedule.tasks[t.id];
    });
    this.currSchedule = this.currSchedule;
  }

  @action async deleteTask(taskId: string): Promise<void> {
    if (!this.user || !this.currSchedule) return;
    const docRef = doc(this.db, `users/${this.user.id}/schedules/${this.currSchedule.id}/tasks`, taskId);
    await deleteDoc(docRef).catch(() => console.log('Failed to delete task'));
    delete this.currSchedule.tasks[taskId];
    this.currSchedule = this.currSchedule;
  }

  @action async addSchedule(newScheduleName: string): Promise<void> {
    if(!this.user) return
    const newSchedule = {name: newScheduleName, courses: []}
    const colRef = collection(this.db, `users/${this.user.id}/schedules`)
    await addDoc(colRef, newSchedule).then(docRef => {
      this.schedules[docRef.id] = {...newSchedule, id: docRef.id, tasks: {}}
      this.schedules = this.schedules
    }).catch(()=> console.log('Failed to add new schedule'))
  }

  @action async deleteSchedule(id: string): Promise<void> {
    if(!this.user) return
    const docRef = doc(this.db, `users/${this.user.id}/schedules`, id)
    await deleteDoc(docRef).catch(() => console.log('Failed to delete schedule'));
    delete this.schedules[id]
    this.schedules = this.schedules
  }
}
