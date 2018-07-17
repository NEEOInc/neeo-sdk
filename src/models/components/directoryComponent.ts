import { UIComponent } from './uiComponent';

export interface DirectoryComponent extends UIComponent {
  isQueue?: boolean;
  identifier?: string;
  isRoot?: boolean;
}
