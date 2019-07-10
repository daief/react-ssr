export function getProp<T = any>(fn: () => T, defaultValue?: any): T {
  let result: any;
  try {
    result = fn();
    return result !== undefined && result !== null ? result : defaultValue;
  } catch (error) {
    return defaultValue !== undefined && result !== null
      ? defaultValue
      : undefined;
  }
}
