import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import FirestoreService from '../services/firestore';

export default class SchedulesController extends Controller {
    @service firestore!: FirestoreService
    @service router!: RouterService

    @action transitionToSchedule(id: string): void {
        this.router.transitionTo(`/schedules/${id}`);
    }
}
