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
