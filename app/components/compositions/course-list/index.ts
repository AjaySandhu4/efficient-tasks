import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'; //Monitor this and if it doesn't work potentially use 'tracked-built-ins'
import FirestoreService, { Course } from '../../../services/firestore'
import { service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  selectedCourse?: Course,
  onScheduleNameChange: (name: string) => void,
  onSelectCourse: (course?: Course) => void,
}

export default class CompositionsCourseListComponent extends Component<Args> {
  @service firestore!: FirestoreService;

  @tracked creationMode: boolean = false;
  @tracked courseToEdit?: Course;
  @tracked scheduleName?: string = this.firestore.currSchedule?.name;

  @action onScheduleNameChange(): void {
    if(this.scheduleName && this.scheduleName !== this.firestore.currSchedule?.name){
      this.args.onScheduleNameChange(this.scheduleName)
    }
  }

  @action onSelectCourse(course: Course): void {
    if(course.code === this.args.selectedCourse?.code){
      this.args.onSelectCourse(undefined);
      return;
    } 
    this.args.onSelectCourse(course);
  }

  @action async deleteCourse(): Promise<void> {
    if(!this.courseToEdit) return;
    await this.firestore.deleteCourse(this.courseToEdit);
    if(this.courseToEdit.code === this.args.selectedCourse?.code) this.args.onSelectCourse(undefined)
    this.courseToEdit = undefined;
  }
}
