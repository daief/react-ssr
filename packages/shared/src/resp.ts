export enum RESPONSE_CODE {
  SUCCESS = '000000',
  TOKEN_INVALID = '100000',
  FAIL = '800000',
  SYSTEM_ERROR = '900000',
}

export interface Resp<T = any> {
  code: RESPONSE_CODE;
  message: string;
  content: T;
}
