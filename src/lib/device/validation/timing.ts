import { TimingSpecifier } from '../../models';

const MAXIMAL_TIMING_VALUE_MS = 60 * 1000;

export {
  validate,
};

function validate(param: TimingSpecifier) {
  if (!param) {
    throw new Error('INVALID_TIMING_PARAMETER');
  }

  const { powerOnDelayMs, sourceSwitchDelayMs, shutdownDelayMs } = param;

  validateTiming(powerOnDelayMs, 'powerOnDelayMs');
  validateTiming(sourceSwitchDelayMs, 'sourceSwitchDelayMs');
  validateTiming(shutdownDelayMs, 'shutdownDelayMs');

  const allTimingMissing = !powerOnDelayMs && !sourceSwitchDelayMs && !shutdownDelayMs;
  if (allTimingMissing) {
    throw new Error('INVALID_TIMING_PARAMETER: at least one timing property is needed');
  }
}

function validateTiming(timeMs: number | undefined, propertyName: string) {
  if (timeMs === undefined) {
    return;
  }
  if (!Number.isInteger(timeMs)) {
    throw new Error(`INVALID_TIMING_VALUE: ${propertyName} must be an integer`);
  }
  if (timeMs < 0 || timeMs > MAXIMAL_TIMING_VALUE_MS) {
    throw new Error(`INVALID_TIMING_VALUE: ${propertyName} must be between 0 and ${MAXIMAL_TIMING_VALUE_MS}`);
  }
}
