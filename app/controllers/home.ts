import Controller from '@ember/controller';
import { service } from '@ember/service';
import FirestoreService, { Task } from '../services/firestore';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Schedule } from '../services/firestore';
import RouterService from '@ember/routing/router-service';

type upcomingTaskFilter =
  | 'Due within a day'
  | 'Due within a week'
  | 'Due within 2 weeks'
  | 'Due within a month';

export default class HomeController extends Controller {
  filters: string[] = [
    'Due within a day',
    'Due within a week',
    'Due within 2 weeks',
    'Due within a month',
  ];
  @service firestore!: FirestoreService;
  @service router!: RouterService;

  @tracked schedule?: Schedule = this.firestore.currSchedule;

  @tracked taskFilter?: upcomingTaskFilter = 'Due within a week';

  get filteredTasks(): Task[] {
    if (!this.schedule) return [];
    let millisecondDifference: number;
    if (this.taskFilter === 'Due within a day')
      millisecondDifference = 1000 * 60 * 60 * 24;
    else if (this.taskFilter === 'Due within a week')
      millisecondDifference = 1000 * 60 * 60 * 24 * 7;
    else if (this.taskFilter === 'Due within 2 weeks')
      millisecondDifference = 1000 * 60 * 60 * 24 * 7 * 2;
    else millisecondDifference = 1000 * 60 * 60 * 24 * 31;
    return Object.values(this.schedule.tasks).filter((t) =>
      t.dueDate
        ? t.dueDate.getTime() - Date.now() <= millisecondDifference &&
          t.dueDate.getTime() - Date.now() > 0
        : false
    );
  }

  @action courseCompletion(courseCode: string): number {
    if (!this.schedule) return 0;
    let completed: number = 0;
    Object.values(this.schedule?.tasks).forEach((t) => {
      if (t.courseCode !== courseCode || !t.weight) return;
      if (t.isCompleted) completed += t.weight;
    });
    return completed;
  }

  @action async setupSchedule(): Promise<void> {
    if (
      !this.firestore.user.activeSchedule ||
      this.firestore.user.activeSchedule === this.firestore.currSchedule?.id
    )
      return;
    await this.firestore.setupSchedule(this.firestore.user.activeSchedule);
    this.schedule = this.firestore.currSchedule;
  }

  @action transitionToSchedule(): void {
    this.router.transitionTo('schedules.schedule', this.schedule?.id ?? '');
  }
}
