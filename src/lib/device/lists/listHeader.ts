export class ListHeader {
  public readonly isHeader = true;
  public readonly title: string;

  constructor(text: string) {
    this.title = text || '';
  }
}
