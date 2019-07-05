import { GQLContext } from '@/interface';
import { RESPONSE_CODE } from '@react-ssr/shared';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ILoginResultResp, LoginResultResp } from '../gql-types/authorization';
import { EmptyContentResp } from '../gql-types/typeFactory';

@Resolver()
export class AuthorizationResolver {
  @Mutation(_ => LoginResultResp)
  public async login(
    @Ctx() ctx: GQLContext,
    @Arg('account') account: string,
    @Arg('password') password: string,
  ): Promise<ILoginResultResp> {
    const resp = await ctx.dataSources.unifiedCertificationService.restGet(
      '/login',
      {
        account,
        password,
      },
    );
    ctx.setToken({
      token: resp.content.token,
    });
    return resp;
  }

  @Mutation(_ => EmptyContentResp, { description: 'logout api' })
  public async logout(@Ctx() { setToken }: GQLContext): Promise<
    EmptyContentResp
  > {
    setToken({
      deleted: true,
    });
    return {
      code: RESPONSE_CODE.SUCCESS,
    };
  }

  @Query(_ => LoginResultResp)
  public async userInfo(@Ctx() ctx: GQLContext): Promise<ILoginResultResp> {
    return {
      code: '111ddd',
      message: 'success',
      content: {
        token: 'ddd',
      },
    };
  }
}
