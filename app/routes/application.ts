import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import FirestoreService from '../services/firestore';

export default class ApplicationRoute extends Route {
  @service firestore!: FirestoreService;
  @service router!: RouterService;
  async beforeModel(): Promise<void> {
    if (window.location.pathname.includes('schedule')) {
      localStorage.setItem(
        'redirect-url',
        `${window.location.pathname}${window.location.search}`
      );
    }
    if (!this.firestore.isLoggedIn) {
      this.firestore.setupApp();
      this.router.transitionTo('login');
    }
  }
}
