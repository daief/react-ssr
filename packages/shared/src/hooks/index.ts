import { ApolloError, OperationVariables } from 'apollo-client';
import { DocumentNode } from 'graphql';
import {
  BaseMutationHookOptions,
  MutationFn,
  MutationHookOptions,
  useMutation,
} from 'react-apollo-hooks';
import { getProp } from '../utils';

export interface MutationExtendResult<TData> {
  called: boolean;
  data?: TData;
  // error 包含各种情况，网络、code 失败
  error?: ApolloError;
  hasError: boolean;
  loading: boolean;

  // 将 error 转化一些简要信息，如果有多个 error，提起第一个
  errorMessage?: string;
  code?: string;
}

export function useMutationExtend<TData, TVariables = OperationVariables>(
  mutation: DocumentNode,
  baseOptions?: MutationHookOptions<TData, TVariables>,
): [MutationFn<TData, TVariables>, MutationExtendResult<TData>] {
  const [fn, result] = useMutation(mutation, baseOptions);

  const getCustomerError = (error: ApolloError) => {
    let errorMessage = getProp(() => error.networkError)
      ? 'Network Error'
      : void 0;
    let code;
    const errors = getProp(() => error.graphQLErrors, []);
    if (errors.length && !errorMessage) {
      errorMessage = errors[0].message;
      code = getProp(() => errors[0].extensions.code);
    }
    return {
      errorMessage,
      code,
    };
  };

  return [
    (options?: BaseMutationHookOptions<TData, TVariables>) => {
      return fn(options).catch(e => {
        throw {
          ...e,
          ...getCustomerError(e),
        };
      });
    },
    {
      ...result,
      ...getCustomerError(result.error),
    },
  ];
}
