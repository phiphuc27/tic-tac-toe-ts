import { PubSub } from 'apollo-server-express';
import { Request, Response } from 'express';
import { User } from '../entities/User';

export type MyContext = {
  req: Request;
  res: Response;
  user?: User;
};
