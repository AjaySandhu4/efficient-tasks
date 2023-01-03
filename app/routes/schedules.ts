import Route from '@ember/routing/route';
import { service } from '@ember/service';
import FirestoreService from '../services/firestore'

export default class SchedulesRoute extends Route {
  @service firestore!: FirestoreService;
  async beforeModel(): Promise<void> {
    await this.firestore.setup();
    console.log(this.firestore.schedules)
  }
}
