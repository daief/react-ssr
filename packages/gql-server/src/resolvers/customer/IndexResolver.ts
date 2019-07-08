import { GQLContext } from '@/interface';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import {
  CustomerListInput,
  CustomerListResponse,
  ICustomerListResponse,
} from '../gql-types/customer';

@Resolver()
export class IndexResolver {
  @Query(_ => CustomerListResponse)
  public async customerList(
    @Ctx() ctx: GQLContext,
    @Arg('input', _ => CustomerListInput, { nullable: true })
    input?: CustomerListInput,
  ): Promise<ICustomerListResponse> {
    // 请求不同的服务
    const resp = await ctx.dataSources.customerService.restGet<
      ICustomerListResponse
    >('/customer/list', input);
    return resp;
  }
}
