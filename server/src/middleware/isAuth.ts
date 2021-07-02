import { AuthenticationError } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/ContextType';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization || !authorization.startsWith('Bearer'))
    throw new AuthenticationError('Not authenticated');

  try {
    const token = authorization.split(' ')[1];

    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);

    context.payload = payload as any;
  } catch (err) {
    console.error(err);
    throw new AuthenticationError('Not authenticated');
  }

  return next();
};
