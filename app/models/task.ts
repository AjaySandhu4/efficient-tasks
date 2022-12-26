export default class Task {
  dueDate: Date;
  courseCode: string;
  taskType: string;
  taskName: string;
  weight: number;
  isCompleted: boolean;

  constructor(
    dueDate: Date,
    courseCode: string,
    taskType: string,
    taskName: string,
    weight: number,
    isCompleted: boolean
  ) {
    this.dueDate = dueDate;
    this.courseCode = courseCode;
    this.taskType = taskType;
    this.taskName = taskName;
    this.weight = weight;
    this.isCompleted = isCompleted;
  }
}
