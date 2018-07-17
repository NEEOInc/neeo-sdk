import { UIComponent } from './uiComponent';

export interface ImageComponent extends UIComponent {
  imageUri: string | null;
  size: 'small' | 'large';
  sensor: string;
}
