export default class Course {
  code;
  color;
  name;
  constructor(code: string, color: string, name: string = '') {
    this.code = code;
    this.color = color;
    this.name = name;
  }
}
