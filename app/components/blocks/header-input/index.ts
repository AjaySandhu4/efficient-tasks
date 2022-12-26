import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Args {
  value: string;
  placeholder: string;
  onSubmit: (name: string) => void;
}

export default class BlocksHeaderInputComponent extends Component<Args> {
  @tracked currInput: string = this.args.value;

  @action submit(): void {
    if (this.currInput != this.args.value) this.args.onSubmit(this.currInput);
  }
}
