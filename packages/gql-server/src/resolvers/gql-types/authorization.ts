import { Field, ID, ObjectType } from 'type-graphql';
import { createResp } from './typeFactory';

@ObjectType()
export class LoginResult {
  @Field()
  public token: string;
}

export const LoginResultResp = createResp(LoginResult);
export type ILoginResultResp = InstanceType<typeof LoginResultResp>;

@ObjectType()
export class UserInfo {
  @Field()
  public username: string;
  @Field()
  public email: string;
}
export const UserInfoResp = createResp(UserInfo);
export type IUserInfoResp = InstanceType<typeof UserInfoResp>;
