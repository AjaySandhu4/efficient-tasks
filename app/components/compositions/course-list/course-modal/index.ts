import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import FirestoreService, { Course } from '../../../../services/firestore';

interface Args {
  onClose: () => void;
  onDelete?: () => Promise<void>;
  course?: Course;
}

export default class CompositionsCourseListCourseModalComponent extends Component<Args> {
  @service firestore!: FirestoreService;
  @tracked courseCode?: string = this.args.course
    ? this.args.course.code
    : undefined;
  @tracked courseColor?: number = this.args.course
    ? this.args.course.color
    : undefined;

  get isDoneButtonDisabled(): boolean {
    if (!this.courseCode || !this.courseColor) return true;
    else if (
      this.courseCode === this.args.course?.code &&
      this.courseColor === this.args.course?.color
    )
      return true;
    else if (
      this.courseCode !== this.args.course?.code &&
      !this.validateCode(this.courseCode)
    )
      return true;
    return false;
  }

  @action async submit(): Promise<void> {
    if (!this.args.course && this.courseColor && this.courseCode) {
      //Adding a new course
      await this.firestore.addCourse({
        code: this.courseCode,
        color: this.courseColor,
      });
    } else if (this.args.course && this.courseColor && this.courseCode) {
      //Editing an existing course
      await this.firestore.updateCourse(this.args.course, {
        code: this.courseCode,
        color: this.courseColor,
      });
    }
    this.args.onClose();
  }

  validateCode(code: string): boolean {
    const isCodeUnique: boolean =
      this.firestore.currSchedule?.courses
        .map((course) => course.code)
        .indexOf(code) === -1;
    return !isEmpty(code) && isCodeUnique;
  }
}
