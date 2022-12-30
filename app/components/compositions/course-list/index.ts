import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'; //Monitor this and if it doesn't work potentially use 'tracked-built-ins'
import FirestoreService, { Course } from '../../../services/firestore'
import { service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  onScheduleNameChange: (name: string) => void;
}

export default class CompositionsCourseListComponent extends Component<Args> {
  @service firestore!: FirestoreService;

  @tracked creationMode: boolean = false;
  @tracked courseToEdit?: Course;
}
