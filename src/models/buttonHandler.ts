/**
 * Method signature for a button handler.
 * @param name The name of the button that was pressed.
 * @param deviceId The target device identifier.
 */
export type ButtonHandler = (
  name: string,
  deviceId: string
) => void | PromiseLike<void>;
