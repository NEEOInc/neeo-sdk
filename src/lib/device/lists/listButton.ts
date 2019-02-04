import * as Models from '../../models';

export class ListButton {
  public readonly isButton = true;
  public readonly title?: string;
  public readonly iconName?: 'shuffle' | 'repeat';
  public readonly inverse?: boolean;
  public readonly actionIdentifier?: string;

  constructor(params: Models.ListButtonParameters) {
    let iconName: 'shuffle' | 'repeat' | undefined;
    ({
      iconName,
      title: this.title,
      inverse: this.inverse,
      // tslint:disable-next-line
      actionIdentifier: this.actionIdentifier
    } = params);
    this.iconName = iconName;
  }
}
