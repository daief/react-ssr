import { RESPONSE_CODE } from '@react-ssr/shared';
import { RESTService } from './dataSource/RESTService';

// 这里对应 schema.ts 中的 dataSources
export interface GQLContext {
  env: string;
  lng: string;
  token: string;
  setToken(p: { token: string; deleted?: boolean }): void;
  dataSources: { unifiedCertificationService: RESTService };
}

export interface Resp<T = any> {
  code: RESPONSE_CODE;
  message: string;
  content: T;
}
