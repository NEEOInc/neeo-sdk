import { UIComponent } from './uiComponent';

export interface DirectoryComponent extends UIComponent {
  identifier?: string;
  role?: string;
}
