import Route from '@ember/routing/route';
import { service } from '@ember/service';
import FirestoreService from '../../services/firestore';

export default class SchedulesScheduleRoute extends Route {
  @service firestore!: FirestoreService;
  async model(params: { id: string }): Promise<void> {
    return await this.firestore.setupSchedule(params.id);
  }
}
