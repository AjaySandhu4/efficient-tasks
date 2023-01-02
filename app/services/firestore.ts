import Service from '@ember/service';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, query, QuerySnapshot, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { tracked } from '@glimmer/tracking';
import { action, set } from '@ember/object'

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
  id: string
}

export default class FirestoreService extends Service {
    db!: Firestore
    app!: FirebaseApp

    @tracked scheduleName: string = ''
    @tracked courses: Course[] = []
    @tracked tasks: {[id: string]: Task} = {};


  @action async setup(): Promise<void> {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

    await this.fetchSchedule();
    await this.fetchTasks();
  }

  @action async fetchSchedule(): Promise<void> {
    const docRef = doc(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules", "4CLPUSS7RVhssk9doRGu");
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.scheduleName = data['name'];
      this.courses = data['courses'];
      console.log(this.scheduleName, this.courses);
    } else {
      console.log("Failed to retrieve the schedule!");
    }
  }

  @action async fetchTasks(): Promise<void> {
    const colRef = collection(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu", "tasks");
    await getDocs(colRef).then((querySnap: QuerySnapshot) => {
      querySnap.forEach(doc => {
        const data = doc.data();
        // this.tasks.push({...data, dueDate: data['dueDate'].toDate()} as Task);
        this.tasks[doc.id] = {...data, dueDate: data['dueDate'].toDate(), id: doc.id} as Task
      });
    });
    console.log(this.tasks);
  }

  @action async updateScheduleName(newName: string): Promise<void> {
    const docRef = doc(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules", "4CLPUSS7RVhssk9doRGu");
    await setDoc(docRef, {name: newName}, { merge: true}).catch(e => console.log(e));
    this.scheduleName = newName;
  }

  @action async addCourse(newCourse: Course): Promise<void> {
    console.log(newCourse);
    const docRef = doc(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules", "4CLPUSS7RVhssk9doRGu");
    await updateDoc(docRef, {
      courses: arrayUnion(newCourse)
    }).catch(e => console.log(e));
    this.courses.push(newCourse);
    this.courses = this.courses
    console.log(this.courses);
  }

  @action async updateCourse(originalCourse: Course, updatedCourse: Course): Promise<void> {
    console.log(originalCourse, updatedCourse);

    //Remove old course and replace with updated version
    const docRef = doc(this.db, 'users/c8i2ObhQPz9mAxfWN7Sa/schedules', '4CLPUSS7RVhssk9doRGu');
    await updateDoc(docRef, {
      courses: arrayRemove(originalCourse)
    }).catch(e => console.log(e));
    await updateDoc(docRef, {
      courses: arrayUnion(updatedCourse)
    }).catch(e => console.log(e));

    //Update each task
    const tasksRef = collection(this.db, 'users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu/tasks');
    const taskQuery = query(tasksRef, where('courseCode', '==', originalCourse.code));
    const batch = writeBatch(this.db);
    await getDocs(taskQuery).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        batch.update(doc.ref, {
          courseCode: updatedCourse.code,
          courseColor: updatedCourse.color,
        });
      });
    }).catch(e => console.log(e));
    batch.commit();

    //Update tasks locally
    Object.values(this.tasks).forEach(t => {
      if(t.courseCode === originalCourse.code){
        set(t, 'courseCode', updatedCourse.code);
        set(t, 'courseColor', updatedCourse.color);
      }
    })
    this.tasks = this.tasks;

    //Update course locally
    let courseToUpdateIndex: number = this.courses.findIndex(c => c.code === originalCourse.code);
    if(courseToUpdateIndex != -1) this.courses[courseToUpdateIndex] = updatedCourse;
    else console.log('Something went wrong updating the course!');
    this.courses = this.courses;
  }

  @action async addTask(newTask: TaskPreValidation): Promise<void> {
    if(!(newTask.courseCode && newTask.courseColor && newTask.dueDate && newTask.name)){
      console.log('Failed to add task');
      return;
    }
    const colRef = collection(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu", "tasks");
    const docRef = await addDoc(colRef, newTask);
    this.tasks[docRef.id] = { ...newTask, id: docRef.id } as Task
    this.tasks = this.tasks;
  }

  @action async updateTask(updatedTask: Task): Promise<void> {
    console.log(updatedTask);
    const docRef = doc(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu/tasks", updatedTask.id);
    await updateDoc(docRef, updatedTask);

    this.tasks[updatedTask.id] = updatedTask;
    this.tasks = this.tasks;
    
  }

  @action async completeTask(isCompleted: boolean, id: string){
    const docRef = doc(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu/tasks", id);
    await updateDoc(docRef, {isCompleted: isCompleted});

    const indexedTask: Task | undefined = this.tasks[id];
    if(indexedTask === undefined) return;
    set(indexedTask, 'isCompleted', isCompleted);  
    // console.log(this.tasks[id])
  }

  @action async deleteCourse(course: Course): Promise<void> {
    //Deleting course on firestore
    const scheduleDocRef = doc(this.db, 'users/c8i2ObhQPz9mAxfWN7Sa/schedules/', '4CLPUSS7RVhssk9doRGu');
    await updateDoc(scheduleDocRef, {courses: arrayRemove(course)});
    const taskColRef = collection(this.db, 'users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu/tasks');
    await getDocs(taskColRef).then(querySnap => {
      querySnap.forEach(doc => {
        const docsCourseCode: string = doc.data()['courseCode'];
        if (docsCourseCode === course.code) deleteDoc(doc.ref);
      })
    })

    //Deleting course locally
    this.courses = this.courses.filter(c => c.code !== course.code);
    Object.values(this.tasks).forEach(t => {
      if (t.courseCode === course.code) delete this.tasks[t.id];
    });
    this.tasks = this.tasks;
  }

  @action async deleteTask(taskId: string): Promise<void> {
    const docRef = doc(this.db, 'users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu/tasks', taskId);
    await deleteDoc(docRef);
    delete this.tasks[taskId];
    this.tasks = this.tasks;
  }
}
