import { UIComponent } from './uiComponent';

export interface SliderComponent extends UIComponent {
  readonly slider: {
    readonly type: string;
    readonly sensor: string;
    readonly range: ReadonlyArray<number>;
    readonly unit: string;
  };
}
