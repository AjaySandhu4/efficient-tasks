import { action } from '@ember/object';
import Component from '@glimmer/component';

interface Args {
    onClick: () => void
    warningMsg: string
}

export default class BlocksDeleteButtonComponent extends Component<Args> {
    @action onClick(): void {
        const isDeleteConfirmed: boolean = confirm(this.args.warningMsg);
        if(!isDeleteConfirmed) return;
        this.args.onClick();
    }
}
