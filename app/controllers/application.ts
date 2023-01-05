import Controller from '@ember/controller';
import { service } from '@ember/service';
import FirestoreService from '../services/firestore';

export default class ApplicationController extends Controller {
    @service firestore!: FirestoreService;
}
