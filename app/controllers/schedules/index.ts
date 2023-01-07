import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import FirestoreService from '../../services/firestore';
import { isEmpty } from '@ember/utils'

export default class SchedulesIndexController extends Controller {
    @service firestore!: FirestoreService
    @service router!: RouterService

    @tracked creationMode = false
    @tracked newScheduleName?: string

    get isNewScheduleValid(): boolean {
        return !isEmpty(this.newScheduleName)
    }

    @action transitionToSchedule(id: string): void {
        this.router.transitionTo('schedules.schedule', id)
    }

    @action async addSchedule(): Promise<void>{
        if(this.newScheduleName){
            await this.firestore.addSchedule(this.newScheduleName)
        }
        this.creationMode = false
        this.newScheduleName = ''
    }
}