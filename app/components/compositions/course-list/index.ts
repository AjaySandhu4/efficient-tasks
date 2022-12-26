import Component from '@glimmer/component';
import Course from 'efficient-tasks/models/course';
import { tracked } from '@glimmer/tracking'; //Monitor this and if it doesn't work potentially use 'tracked-built-ins'
import FirestoreService from '../../../services/firestore'
import { service } from '@ember/service';

interface Args {
  onScheduleNameChange: (name: string) => void;
}

export default class CompositionsCourseListComponent extends Component<Args> {
  @service firestore!: FirestoreService;

  @tracked courseCreationMode: boolean = false;
}
