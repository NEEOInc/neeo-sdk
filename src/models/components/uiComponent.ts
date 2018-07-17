import { Component } from './component';

export interface UIComponent extends Component {
  readonly label?: string;
}
