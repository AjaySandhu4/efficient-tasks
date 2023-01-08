import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Args {
  value: string;
  placeholder: string;
  // eslint-disable-next-line no-unused-vars
  onInput: (name: string) => void;
}

export default class BlocksHeaderInputComponent extends Component<Args> {
  @tracked currInput: string = this.args.value;
}
