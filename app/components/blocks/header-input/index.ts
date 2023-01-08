import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Args {
  value: string;
  placeholder: string;
  onInput: (name: string) => void;
}

export default class BlocksHeaderInputComponent extends Component<Args> {
  @tracked currInput: string = this.args.value;
}
