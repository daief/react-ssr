import { CONFIG } from '@/CONFIG';
import { GQLContext, Resp } from '@/interface';
import { fakeRequestRest } from '@/mock';
import { Log, RESPONSE_CODE } from '@react-ssr/shared';
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import { URLSearchParamsInit } from 'apollo-server-env';
import { ApolloError } from 'apollo-server-errors';

function isVaildString(val: string | null) {
  return val && typeof val === 'string' && val.length;
}

// ! 使用需注意这里的 class
// https://github.com/apollographql/apollo-server/issues/1388#issuecomment-406756378
export class RESTService extends RESTDataSource<GQLContext> {
  private baseurl: string;
  private headers: Map<string, string>;

  constructor({
    baseurl,
    headers,
  }: {
    baseurl: string;
    headers: Map<string, string>;
  }) {
    super();

    this.baseurl = baseurl;
    this.headers = headers;
  }

  protected willProxyAgent(request: RequestOptions) {
    //
  }

  protected willSendRequest(request: RequestOptions) {
    this.willProxyAgent(request);
    this.headers.forEach((val, key) => {
      request.headers.set(key, val);
    });
    // 将 token 真正向后端请求
    if (typeof this.context !== 'undefined') {
      if (isVaildString(this.context.token)) {
        request.headers.set(
          'Authorization',
          `Bearer ${this.context.token.replace(/^Bearer\s+/, '')}`,
        );
      }
      if (isVaildString(this.context.lng)) {
        request.headers.set('x-c-locale', this.context.lng.replace(/-/g, '_'));
      }
    }
  }

  get baseURL() {
    return this.baseurl;
  }

  public get token() {
    return this.context.token;
  }

  public set token(value) {
    this.context.token = value;
  }

  protected vaildResponeCode<T extends Resp>(body: T) {
    if (body.code !== RESPONSE_CODE.SUCCESS) {
      throw new ApolloError(body.message, body.code, { response: body });
    }
    return body;
  }

  public async restGet<T = any>(path: string, params?: URLSearchParamsInit) {
    if (process.env.NODE_ENV === 'development') {
      Log.Info(
        'GET',
        [this.baseURL, path].join(''),
        JSON.stringify(params || {}),
      );
    }

    if (CONFIG.isMock) {
      return this.sendMockReq('GET', path, params);
    }

    const info = await super.get<Resp<T>>(path, params).catch(e => {
      Log.Error('Request - restGet fail:', e);
      return e;
    });
    this.vaildResponeCode(info);
    return info;
  }

  public async restPost<T = any>(path: string, body?: BodyInit | object) {
    if (process.env.NODE_ENV === 'development') {
      Log.Info(
        'POST',
        [this.baseURL, path].join(''),
        JSON.stringify(body || {}),
      );
    }

    if (CONFIG.isMock) {
      return this.sendMockReq('POST', path, body);
    }

    const info = await super.post<Resp<T>>(path, body).catch(e => {
      Log.Error('Request - restPost fail:', e);
      return e;
    });
    this.vaildResponeCode(info);
    return info;
  }

  private async sendMockReq(method: any, path: string, data: any) {
    const mockResult = await fakeRequestRest(this.baseURL, {
      method,
      path,
      data,
      headers: {
        ...this.context.req.headers,
        Authorization: this.token,
        'x-c-locale': this.context.lng,
        clientKey: this.headers.get('clientKey'),
      },
    });
    this.vaildResponeCode(mockResult);
    return mockResult;
  }
}
