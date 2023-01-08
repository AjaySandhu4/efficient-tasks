import { action, set } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import FirestoreService, { Course, Task, TaskPreValidation } from '../../../../services/firestore'
import { cloneDeep, isEqual } from 'lodash'

interface Args {
    onClose: () => void
    task?: Task
}
export default class CompositionsTasksTableTaskUpdateModalComponent extends Component<Args> {
    initModel: TaskPreValidation = {
        isCompleted: false,
        courseCode: '',
        courseColor: 0,
        type: '',
        name: '',
        dueDate: null,
        weight: -1,
        id: 'TBD'
    }

    @service firestore!: FirestoreService
    taskTypes: string[] = ['Exam', 'Test', 'Assignment', 'Quiz', 'Other'];

    @tracked taskModel: TaskPreValidation = cloneDeep(this.args.task) ?? cloneDeep(this.initModel);

    get isFormDirty(): boolean {
        // console.log(this.taskModel);
        if(isEqual(this.taskModel, this.args.task)) return true; //Check if task is unchanged
        const associatedCourse: Course | undefined = this.firestore.currSchedule?.courses.find(c => c.code === this.taskModel.courseCode);
        if(!associatedCourse || associatedCourse.color != this.taskModel.courseColor) return true;
        if(isEmpty(this.taskModel.name) || isEmpty(this.taskModel.type) || this.taskModel.weight === -1) return true;
        return false;
    }
    
    @action sayHello(): void {
        console.log(this.taskModel);
    }

    @action updateCourse(course: Course): void {
        set(this.taskModel, 'courseCode', course.code);
        set(this.taskModel, 'courseColor', course.color);
        this.taskModel = this.taskModel;
    }

    @action updateWeight(event: InputEvent): void {
        const element = event.target as HTMLInputElement
        let value = element.value
        set(this.taskModel, 'weight', parseFloat(parseFloat(value).toFixed(2)));
        this.taskModel = this.taskModel;
    }

    @action updateDueDate(input: any): void {
        set(this.taskModel, 'dueDate', input[0]);
        this.taskModel = this.taskModel;
    }

    @action updateName(event: InputEvent): void {
        const element = event.target as HTMLInputElement
        let value = element.value
        set(this.taskModel, 'name', value);
        this.taskModel = this.taskModel;
    }

    @action submit(): void {
        if(this.args.task){
            this.firestore.updateTask(this.taskModel as Task);
        }
        else{
            this.firestore.addTask(this.taskModel);
        }
    }

    @action async deleteTask(): Promise<void> {
        if(!this.args.task) return;
        await this.firestore.deleteTask(this.args.task.id);
        this.args.onClose();
    }


}
