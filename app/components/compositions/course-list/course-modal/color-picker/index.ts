import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import FirestoreService from '../../../../../services/firestore';

interface Args {
  selectedColor: number;
  // eslint-disable-next-line no-unused-vars
  onSelectColor: (color: number) => void;
}

export default class CompositionsCourseListCourseModalColorPickerComponent extends Component<Args> {
  @service firestore!: FirestoreService;
  @tracked selectedColor?: number = this.args.selectedColor;
  originalColor?: number = this.args.selectedColor;

  get availableColors(): { [index: number]: boolean } {
    const availability: { [index: number]: boolean } = {};
    for (let i: number = 1; i <= 10; ++i) availability[i] = true;
    this.firestore.currSchedule?.courses.forEach((c) => {
      if (c.color !== this.originalColor) availability[c.color] = false;
    });
    return availability;
  }

  @action onSelect(color: string): void {
    const parsedColorNum = parseInt(color);
    this.selectedColor = parsedColorNum;
    this.args.onSelectColor(parsedColorNum);
  }

  @action isSelectedColor(color: any): boolean {
    const parsedColorNum = parseInt(color);
    return this.selectedColor === parsedColorNum;
  }
}
