/**
 * An interface for specifying the delays NEEO should use when interacting with a device.
 */
export interface TimingSpecifier {
  /**
   * Specifies the number of milliseconds NEEO should waiting after powering on the device
   * before sending it another command.
   */
  powerOnDelayMs?: number;
  /**
   * Specifies the number of milliseconds NEEO should waiting after switching input on the device
   * before sending it another command.
   */
  sourceSwitchDelayMs?: number;
  /**
   * Specifies the number of milliseconds NEEO should waiting after shutting down the device
   * before sending it another command.
   */
  shutdownDelayMs?: number;
}
