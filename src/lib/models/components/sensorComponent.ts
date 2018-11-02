import { UIComponent } from './uiComponent';

export interface SensorComponent extends UIComponent {
  readonly sensor: string | Sensor;
}

export interface Sensor {
  readonly type: string;
  readonly sensor?: string;
  readonly range?: ReadonlyArray<number>;
  readonly unit?: string;
}
