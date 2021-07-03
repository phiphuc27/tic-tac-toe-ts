import { Chat, Room } from '../entities/Chat';
import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';
import { v4 } from 'uuid';
import { MyContext } from '../types/ContextType';
import { isAuth } from '../middleware/isAuth';

interface Rooms {
  [index: string]: Room;
}

@Resolver(Room)
export class ChatResolver {
  private rooms: Rooms = {};

  @Subscription({
    topics: ({ args }) => args.roomId,
  })
  joinRoom(@Root() { id, chats }: Room, @Arg('roomId') roomId: string): Room {
    return { id, chats };
  }

  @Query(() => Room, { nullable: true })
  getChatsInRoom(@Arg('room') roomId: string) {
    return this.rooms[roomId];
  }

  @Mutation(() => Chat)
  @UseMiddleware(isAuth)
  async createChat(
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { user }: MyContext,
    @Arg('message') message: string,
    @Arg('roomId') roomId: string
  ): Promise<Chat> {
    let room = this.rooms[roomId];

    if (!room) {
      this.rooms[roomId] = {
        id: roomId,
        chats: [],
      };
    }

    room = this.rooms[roomId];
    const chat: Chat = { id: v4(), user: user!.username, message };
    room.chats.push(chat);
    await pubSub.publish(roomId, room);

    return chat;
  }
}
