/**
 * Wrapper for `console.log(...)` that prepends `ℹ️` to the message.
 */
export const logInformation = (message?: any, ...optionalParams: any[]) =>
  console.log(`ℹ️ ${message}`, optionalParams);
