import { User } from '../entities/User';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({});
  }

  @Query(() => User, { nullable: true })
  user(@Arg('id') id: string): Promise<User | undefined> {
    return User.findOne(id);
  }
}
