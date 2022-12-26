import Component from '@glimmer/component';
import { faker } from '@faker-js/faker';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service'
import FirestoreService from '../../../services/firestore'
import Task from '../../../models/task';

// interface Args {}

// interface Row {
//   dueDate: string;
//   courseCode: string;
//   taskType: string;
//   taskName: string;
//   weight: number;
//   isCompleted: boolean;
// }

export interface Column {
  cellComponent?: string;
  isResizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  name?: string;
  textAlign?: string;
  valuePath?: string;
  width?: number;
}

export default class CompositionsTasksTableComponent extends Component {
  testTaskTypes: string[] = [
    'Assignment',
    'Exam',
    'Quiz',
    'Test',
    'Presentation',
    'Reading',
  ];

  @service firestore!: FirestoreService;

  @tracked selectedTask?: Task;

  get columns(): Column[] {
    return [
      {
        name: 'Due Date',
        valuePath: 'dueDate',
        textAlign: 'center',
        width: 125,
      },
      {
        name: 'Course Code',
        valuePath: 'courseCode',
        textAlign: 'center',
        width: 150,
      },
      {
        name: 'Task Type',
        valuePath: 'taskType',
        textAlign: 'left',
        width: 150,
      },
      {
        name: 'Task Name',
        valuePath: 'taskName',
        textAlign: 'left',
        width: 300,
      },
      {
        name: 'Weight',
        valuePath: 'weight',
        textAlign: 'center',
        width: 100,
      },
      {
        name: 'Completed',
        valuePath: 'isCompleted',
        textAlign: 'center',
        width: 100,
      },
    ];
  }

  get rows(): Task[] {
    // const rowArray: Row[] = [];
    // for (let i = 0; i < 12; ++i) {
    //   const dueDate: Date = faker.date.future();
    //   rowArray.push({
    //     dueDate: `${dueDate.getMonth() + 1}/${dueDate.getDate()}`,
    //     courseCode: 'COMP3005A',
    //     taskType:
    //       this.testTaskTypes[faker.datatype.number({ min: 0, max: 5 })] ?? '',
    //     taskName: faker.random.words(),
    //     weight: faker.datatype.number(100),
    //     isCompleted: faker.datatype.boolean(),
    //   });
    // }
    // return rowArray;
    return this.firestore.tasks;
  }

  @action sayHello(): void {
    console.log('Hello!');
  }
}
