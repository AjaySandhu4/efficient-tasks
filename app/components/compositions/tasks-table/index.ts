import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import FirestoreService, { Task } from '../../../services/firestore';
import { Course } from '../../../services/firestore';

interface Args {
  selectedCourse: Course;
}
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

export default class CompositionsTasksTableComponent extends Component<Args> {
  dateFilterOptions = ['All', 'Upcoming', 'Past', 'TBD'];
  completionFilterOptions = ['All', 'Incomplete', 'Complete'];

  @service firestore!: FirestoreService;

  @tracked selectedTask?: Task;
  @tracked dateFilter?: string;
  @tracked completionFilter?: string;

  // @tracked rows: Task[] = Object.values(
  //   this.firestore.currSchedule?.tasks ?? {}
  // );

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
        valuePath: 'type',
        textAlign: 'left',
        width: 150,
      },
      {
        name: 'Task Name',
        valuePath: 'name',
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

  get filteredRows(): Task[] {
    let rows: Task[] = this.firestore.currSchedule
      ? Object.values(this.firestore.currSchedule?.tasks)
      : [];

    if (this.args.selectedCourse) {
      rows = rows.filter((t) => t.courseCode === this.args.selectedCourse.code);
    }

    if (this.dateFilter === this.dateFilterOptions[1]) {
      //Upcoming tasks
      console.log('Should be filtering by this');
      rows = rows.filter(
        (t) => !t.dueDate || Date.now() - t.dueDate.getTime() <= 0
      );
    } else if (this.dateFilter === this.dateFilterOptions[2]) {
      //Past tasks
      rows = rows.filter(
        (t) => t.dueDate && Date.now() - t.dueDate.getTime() > 0
      );
    } else if (this.dateFilter === this.dateFilterOptions[3]) {
      //TBD tasks
      rows = rows.filter((t) => !t.dueDate);
    }

    if (this.completionFilter === this.completionFilterOptions[1]) {
      //Incomplete tasks
      rows = rows.filter((t) => !t.isCompleted);
    } else if (this.completionFilter === this.completionFilterOptions[2]) {
      //Complete tasks
      rows = rows.filter((t) => t.isCompleted);
    }

    rows.sort((taskA, taskB) => {
      if (taskA.dueDate && taskB.dueDate)
        return taskA.dueDate.getTime() - taskB.dueDate.getTime();
      else if (!(taskA.dueDate || taskB.dueDate)) return 0;
      else if (!taskA.dueDate) return 1;
      else return -1;
    });

    return rows;
  }

  @action onSelectTask(task: Task): void {
    if (task.id === this.selectedTask?.id) {
      this.selectedTask = undefined;
    } else {
      this.selectedTask = task;
    }
  }

  @action completeTask(isCurrentlyCompleted: boolean, id: string) {
    this.firestore.completeTask(!isCurrentlyCompleted, id);
  }
}
