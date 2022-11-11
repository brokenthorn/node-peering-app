/**
 * A tuple of a boolean and an optional string.
 * The boolean is `true` if no errors ocurred during an operation.
 * The string is an optional error message to be used if the boolean
 * is set to `false`, to relay the cause of the error.
 */
export type TupleResult = [boolean, string?];

/**
 * Wrapper for `console.log(...)` that prepends `ℹ️` to the message.
 */
export const logInformation = (message?: any, ...optionalParams: any[]) =>
  console.log(`ℹ️ ${message}`, optionalParams);
