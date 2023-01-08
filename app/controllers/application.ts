import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { getAuth } from 'firebase/auth';
import FirestoreService from '../services/firestore';

export default class ApplicationController extends Controller {
  @service firestore!: FirestoreService;

  @action handleSignOut(): void {
    getAuth(this.firestore.app).signOut();
  }
}
