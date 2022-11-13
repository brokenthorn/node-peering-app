/**
 * A tuple of a boolean and an optional string.
 * The boolean is `true` if no errors ocurred during an operation.
 * The string is an optional error message to be used if the boolean
 * is set to `false`, to relay the cause of the error.
 */
export type TupleResult = readonly [boolean, string?];

/**
 * Wrapper for `console.log(...)` that prepends `INFO:` to the message.
 */
export const logInformation = (message?: any, ...optionalParams: any[]) =>
  console.log(`INFO: ${message}`, ...optionalParams);

/**
 * Wrapper for `console.error(...)` that prepends `ERROR:` to the message.
 */
export const logError = (message?: any, ...optionalParams: any[]) =>
  console.error(`ERROR: ${message}`, ...optionalParams);
