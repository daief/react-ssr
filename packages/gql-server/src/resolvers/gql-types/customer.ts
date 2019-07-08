import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { DateScalar } from './scalars';
import { createListResp } from './typeFactory';

@ObjectType()
export class Order {
  @Field(_ => ID)
  public id: string;
  @Field(_ => DateScalar)
  public createTime: Date;
}

@ObjectType()
export class Customer {
  @Field(_ => ID)
  public id: string;
  @Field()
  public name: string;
  @Field(_ => Int)
  public age: number;
  @Field(_ => [Order])
  public orderList: Order[];
}

export const CustomerListResponse = createListResp(Customer);
export type ICustomerListResponse = InstanceType<typeof CustomerListResponse>;

@InputType()
export class CustomerListInput {
  @Field(_ => DateScalar, { nullable: true })
  public createTime?: Date;
  @Field(_ => Int, { nullable: true })
  public age?: number;
}
