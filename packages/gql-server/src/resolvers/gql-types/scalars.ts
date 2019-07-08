import { GraphQLScalarType, Kind } from 'graphql';

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date scalar type',
  parseValue(value: string | number) {
    return new Date(value); // value from the client input variables
  },
  serialize(value: Date) {
    return value.valueOf(); // value sent to the client
  },
  parseLiteral(ast) {
    if (Kind.STRING === ast.kind || Kind.INT === ast.kind) {
      return new Date(ast.value); // value from the client query
    }
    return null;
  },
});
