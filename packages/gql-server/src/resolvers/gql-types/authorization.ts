import { Field, ID, ObjectType } from 'type-graphql';
import { createResp } from './typeFactory';

@ObjectType()
export class LoginResult {
  @Field()
  public token: string;
}

export const LoginResultResp = createResp(LoginResult);
export type ILoginResultResp = InstanceType<typeof LoginResultResp>;
