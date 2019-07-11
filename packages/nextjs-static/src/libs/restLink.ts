import { RestLink } from 'apollo-link-rest';

// rest link 依赖 Headers
// server 端需要兼容
if (!process.browser) {
  const { Headers } = require('node-fetch');
  // @ts-ignore
  global.Headers = Headers;
}

/**
 * when 404 response is null
 * https://github.com/apollographql/apollo-link-rest/blob/49ecaa41ae95136e6dbf3d97ba55b86e6931926c/src/restLink.ts#L1050
 * other error will throw
 * @param response
 */
const responseTransformer = response => {
  if (response && response.headers) {
    const contentType = response.headers.get('content-type');
    if ((contentType || '').indexOf('application/json') > -1) {
      return response.json().then(data => {
        return data;
      });
    }
    return response;
  }
  return {
    message: 'System error',
  };
};

export const restLink = () => {
  return new RestLink({
    uri: 'https://api.github.com',
    responseTransformer,
  });
};
