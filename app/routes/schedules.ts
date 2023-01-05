import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import FirestoreService from '../services/firestore'

export default class SchedulesRoute extends Route {
  @service firestore!: FirestoreService;
  @service router!: RouterService;
  async beforeModel(): Promise<void> {
    if (isEmpty(this.firestore.user)) {
      this.router.transitionTo('login')
    }
    else{
      await this.firestore.fetchSchedules();
      console.log(this.firestore.schedules)
    }
  }
}
