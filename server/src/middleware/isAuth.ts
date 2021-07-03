import { JwtPayload, verify } from 'jsonwebtoken';
import { User } from '../entities/User';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/ContextType';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization || !authorization.startsWith('Bearer')) {
    context.user = undefined;
    return next();
  }

  try {
    const token = authorization.split(' ')[1];

    const payload = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    const user = await User.findOne(payload.userID);

    context.user = user;
  } catch (err) {
    console.error(err);
    throw new Error('Not authenticated');
  }

  return next();
};
