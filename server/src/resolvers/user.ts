import * as argon2 from 'argon2';
import * as yup from 'yup';
import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { UserResponse } from '../types/UserResponse';
import { RegisterInput, LoginInput } from '../types/UserInput';
import { MyContext } from '../types/ContextType';
import { formatValidateErrors } from '../utils/formatValidateErrors';
import { isAuth } from '../middleware/isAuth';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateToken';
import { setRefreshToken } from '../utils/setRefreshToken';
import { getConnection } from 'typeorm';

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
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: MyContext) {
    return User.findOne(payload?.userID);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('input') input: RegisterInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    // Validate input
    const registerSchema = yup.object().shape({
      email: yup.string().email().required(),
      username: yup.string().required(),
      password: yup.string().min(6).required(),
    });

    try {
      await registerSchema.validate(input);
    } catch (err) {
      return { error: formatValidateErrors(err) };
    }

    // Create new user
    try {
      const hashedPassword = await argon2.hash(input.password);

      const user = await User.create({
        username: input.username,
        email: input.email,
        password: hashedPassword,
      }).save();

      const accessToken = generateAccessToken(user);

      setRefreshToken(res, generateRefreshToken(user));

      return { accessToken, user };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return {
          error: {
            field: 'username',
            message: 'Email or username is already taken.',
          },
        };
      }

      return {
        error: {
          field: 'server',
          message: err.message,
        },
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    // validate input
    const loginSchema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    try {
      await loginSchema.validate(input);
    } catch (err) {
      return { error: formatValidateErrors(err) };
    }

    try {
      const user = await User.findOne({ email: input.email });
      if (!user) {
        return {
          error: {
            field: 'email',
            message: 'Incorrect email or password.',
          },
        };
      }

      const isValidPassword = await argon2.verify(
        user.password,
        input.password
      );
      if (!isValidPassword) {
        return {
          error: {
            field: 'email',
            message: 'Incorrect email or password.',
          },
        };
      }

      const accessToken = generateAccessToken(user);

      setRefreshToken(res, generateRefreshToken(user));

      return { accessToken, user };
    } catch (error) {
      return {
        error: {
          field: 'server',
          message: error.message,
        },
      };
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg('userId') userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    try {
      const user = await User.findOne(id);
      if (!user) return false;

      await User.delete(id);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
