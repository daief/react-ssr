// tslint:disable: no-console
export const Info = (...args: any[]) => {
  console.error('[Info]', ...args);
};

export const Error = (...args: any[]) => {
  console.error('[Error]', ...args);
};

export const Log = {
  Info,
  Error,
};
