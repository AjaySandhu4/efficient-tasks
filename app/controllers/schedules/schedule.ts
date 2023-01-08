import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import FirestoreService, { Course } from '../../services/firestore';

export default class SchedulesScheduleController extends Controller {
  @service firestore!: FirestoreService;

  @tracked selectedCourse?: Course;

  @action async onScheduleNameChange(newName: string): Promise<void> {
    await this.firestore.updateScheduleName(newName);
  }
}
