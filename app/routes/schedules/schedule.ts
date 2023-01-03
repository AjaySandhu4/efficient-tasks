import Route from '@ember/routing/route';
import { service } from '@ember/service';
import FirestoreService from '../../services/firestore'

export default class SchedulesScheduleRoute extends Route {
  @service firestore!: FirestoreService
  model(params: {id: string}) {
    return this.firestore.setupSchedule(params.id);
  }
}
