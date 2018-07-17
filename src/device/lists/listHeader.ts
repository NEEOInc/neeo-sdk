import * as listValidation from '../validation/list';

export class ListHeader {
  readonly isHeader = true;
  readonly title: string;

  constructor(text: string) {
    this.title = listValidation.validateTitle(text);
  }
}
