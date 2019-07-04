import { GQLContext } from '@/interface';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ILoginResultResp, LoginResultResp } from '../gql-types/authorization';

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
    return resp;
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
