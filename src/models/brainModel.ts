/**
 * Model representing a NEEO brain.
 */
export interface BrainModel {
  /**
   * The name of the brain.
   */
  readonly name: string;
  /**
   * The zeroconf/bonjour host name.
   */
  readonly host: string;
  /**
   * The listening port.
   */
  readonly port: number;
  /**
   * Version of the software on the brain.
   */
  readonly version?: string;
  /**
   * The region.
   */
  readonly region?: string;
  /**
   * Array of IP addresses associated with the brain.
   */
  readonly iparray?: ReadonlyArray<string>;
}
