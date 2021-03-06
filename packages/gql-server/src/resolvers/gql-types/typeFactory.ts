import { ClassType, Field, ObjectType } from 'type-graphql';

export function createResp<TContent>(
  Clazz: ClassType<TContent>,
): ClassType<{
  content?: TContent;
  message?: string;
  code: string;
}> {
  @ObjectType(`${Clazz.name}Response`)
  class Response {
    @Field(_ => Clazz, { nullable: true })
    public content?: TContent;
    @Field({ nullable: true })
    public message?: string;
    @Field()
    public code: string;
  }
  return Response;
}

export function createListResp<TContent>(
  Clazz: ClassType<TContent>,
): ClassType<{
  content?: TContent[];
  message?: string;
  code: string;
}> {
  @ObjectType(`${Clazz.name}ListResponse`)
  class Response {
    @Field(_ => [Clazz], { nullable: true })
    public content?: TContent[];
    @Field({ nullable: true })
    public message?: string;
    @Field()
    public code: string;
  }
  return Response;
}

@ObjectType()
export class EmptyContentResp {
  @Field({ nullable: true })
  public message?: string;
  @Field()
  public code: string;
}
