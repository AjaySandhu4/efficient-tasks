import Service from '@ember/service';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, QuerySnapshot, setDoc } from 'firebase/firestore';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object'
import Course from '../models/course';
import Task from '../models/task';

export default class FirestoreService extends Service {
    db!: Firestore
    app!: FirebaseApp

    @tracked scheduleName: string = ''
    @tracked courses: Course[] = []
    @tracked tasks: Task[] = [];


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
      console.log("No such document!");
    }
  }

  @action async fetchTasks(): Promise<void> {
    const colRef = collection(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules/4CLPUSS7RVhssk9doRGu", "tasks");
    await getDocs(colRef).then((querySnap: QuerySnapshot) => {
      querySnap.forEach(doc => {
        const data = doc.data();
        this.tasks.push({...data, dueDate: data['dueDate'].toDate()} as Task);
      });
    });
    console.log(this.tasks);
  }

  @action async updateScheduleName(newName: string): Promise<void> {
    const docRef = doc(this.db, "users/c8i2ObhQPz9mAxfWN7Sa/schedules", "4CLPUSS7RVhssk9doRGu");
    await setDoc(docRef, {name: newName}, { merge: true}).catch(e => console.log(e));
    this.scheduleName = newName;
  }
}
