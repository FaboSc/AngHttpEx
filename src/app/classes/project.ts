export class Project {
  public id;
  public title;
  public note;
  public pStart;

  constructor(id, title, note, pStart) {
    this.id = id;
    this.title = title;
    this.note = note;
    this.pStart = pStart;
  }
}
