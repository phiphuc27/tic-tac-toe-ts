import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Chat {
  @Field(() => ID)
  id: string;

  @Field()
  user: string;

  @Field()
  message: string;
}

@ObjectType()
export class Room {
  @Field(() => ID)
  id: string;

  @Field(() => [Chat])
  chats: Chat[];
}
