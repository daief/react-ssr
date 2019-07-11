import { ApolloError, FetchPolicy, OperationVariables } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { useEffect, useState } from 'react';
import {
  BaseMutationHookOptions,
  MutationFn,
  MutationHookOptions,
  useApolloClient,
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

export function useMutationExtend<TData, TVariables = OperationVariables>(
  mutation: DocumentNode,
  baseOptions?: MutationHookOptions<TData, TVariables>,
): [MutationFn<TData, TVariables>, MutationExtendResult<TData>] {
  const [fn, result] = useMutation(mutation, baseOptions);

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

export interface IUserQueryExtendOptions<TVariables = any> {
  skipFirstFetch?: boolean;
  context?: any;
  variables?: TVariables;
  fetchPolicy?: FetchPolicy;
}

interface IUseQueryExtendResult<TData = any> {
  data?: TData;
  error?: ApolloError;
  errorMessage?: string;
  code?: string;
  loading: boolean;
}

export function useQueryExtend<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: IUserQueryExtendOptions<TVariables>,
): [
  <D extends TData, T extends TVariables>(
    opts?: IUserQueryExtendOptions,
  ) => Promise<IUseQueryExtendResult<TData>>,
  IUseQueryExtendResult<TData>
] {
  // tslint:disable-next-line: variable-name
  const [result, _setResult] = useState<IUseQueryExtendResult<TData>>({
    loading: false,
  });
  const setResult = (partial: Partial<IUseQueryExtendResult<TData>>) =>
    _setResult(pre => ({ ...pre, ...partial }));
  const { skipFirstFetch = false, context, variables, fetchPolicy } = options;
  const client = useApolloClient();

  const request = <D extends TData, T extends TVariables>(
    opts?: IUserQueryExtendOptions<T>,
  ): Promise<IUseQueryExtendResult<D>> => {
    setResult({ loading: true });
    return client
      .query<D>({
        query,
        context,
        variables,
        fetchPolicy,
        ...opts,
      })
      .then(resp => {
        setResult({
          data: resp.data,
        });
        return resp;
      })
      .catch(e => {
        const newError = {
          ...e,
          ...getCustomerError(e),
        };
        setResult({
          data: void 0,
          error: newError,
          ...getCustomerError(e),
        });

        throw newError;
      })
      .finally(() => {
        setResult({ loading: false });
      });
  };

  useEffect(() => {
    if (!skipFirstFetch) {
      request().catch(_ => {
        //
      });
    }
  }, []);

  return [request, result];
}
