import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { getAuth } from 'firebase/auth';
import FirestoreService from '../services/firestore';

export default class ApplicationRoute extends Route {
    @service firestore!: FirestoreService;
    @service router!: RouterService;
    async beforeModel(): Promise<void> {
        if (isEmpty(this.firestore.user)) {
            this.firestore.setupApp();
            console.log(getAuth().currentUser);
            this.router.transitionTo('login')
        }
    }
}
