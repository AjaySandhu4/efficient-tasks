import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import FirestoreService, { Course, TaskPreValidation } from '../../../../services/firestore'
import { cloneDeep, isEqual } from 'lodash'

export default class CompositionsTasksTableTaskCreationModalComponent extends Component {
    initModel: TaskPreValidation = {
        isCompleted: false,
        courseCode: '',
        courseColor: 0,
        type: '',
        name: '',
        dueDate: null,
        weight: -1,
    }

    @service firestore!: FirestoreService
    taskTypes: string[] = ['Exam', 'Test', 'Assignment', 'Quiz', 'Other'];

    @tracked taskModel: TaskPreValidation = cloneDeep(this.initModel);

    get isFormDirty(): boolean {
        // console.log(this.taskModel);
        const associatedCourse: Course | undefined = this.firestore.courses.find(c => c.code === this.taskModel.courseCode);
        if(!associatedCourse || associatedCourse.color != this.taskModel.courseColor) return true;
        if(isEmpty(this.taskModel.name) || isEmpty(this.taskModel.type)) return true;
        return false;
    }
    
    @action sayHello(): void {
        console.log(this.taskModel);
    }

    @action updateCourse(course: Course): void {
        this.taskModel.courseCode = course.code;
        this.taskModel.courseColor = course.color;
        this.taskModel = this.taskModel;
    }

    @action updateWeight(event: InputEvent): void {
        const element = event.target as HTMLInputElement
        let value = element.value
        this.taskModel.weight = parseFloat(parseFloat(value).toFixed(2));
        this.taskModel = this.taskModel;
    }

    @action updateDueDate(input: any): void {
        this.taskModel.dueDate = input[0];
        this.taskModel = this.taskModel;
    }

    @action updateName(event: InputEvent): void {
        const element = event.target as HTMLInputElement
        let value = element.value
        this.taskModel.name = value;
        this.taskModel = this.taskModel;
    }

    @action submit(): void {
        this.firestore.addTask(this.taskModel);
    }


}
