import * as argon2 from 'argon2';
import * as yup from 'yup';
import { User } from '../entities/User';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { UserResponse } from '../types/UserResponse';
import { RegisterInput, LoginInput } from '../types/UserInput';
import { formatValidateErrors } from '../utils/formatValidateErrors';
import { MyContext } from '../types/ContextType';

const registerSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().required(),
  password: yup.string().min(6).required(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
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

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userID) return null;
    return User.findOne(req.session.userID);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('input') input: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      await registerSchema.validate(input, { abortEarly: false });
    } catch (error) {
      const errors = formatValidateErrors(error);
      return { errors };
    }

    try {
      const hashedPassword = await argon2.hash(input.password);

      const user = await User.create({
        username: input.username,
        email: input.email,
        password: hashedPassword,
      }).save();

      req.session.userID = user.id;

      return { user };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return {
          errors: [
            {
              field: 'username',
              message: 'Email or username is already taken.',
            },
          ],
        };
      }

      return {
        errors: [
          {
            field: 'server',
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      await loginSchema.validate(input, { abortEarly: false });

      const user = await User.findOne({ email: input.email });
      if (!user) {
        return {
          errors: [
            {
              field: 'email',
              message: 'Incorrect email or password.',
            },
          ],
        };
      }

      const isValidPassword = await argon2.verify(
        user.password,
        input.password
      );
      if (!isValidPassword) {
        return {
          errors: [
            {
              field: 'email',
              message: 'Incorrect email or password.',
            },
          ],
        };
      }

      req.session.userID = user.id;

      return { user };
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        const errors = formatValidateErrors(error);
        return { errors };
      }

      return {
        errors: [
          {
            field: 'server',
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    try {
      const user = await User.findOne(id);
      if (!user) return false;

      await User.delete(id);

      return true;
    } catch (error) {
      console.error(error);

      return error;
    }
  }
}
