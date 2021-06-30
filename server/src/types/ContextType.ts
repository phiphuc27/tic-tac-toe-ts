import { Request, Response } from 'express';
import { Session } from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    userID: string;
  }
}

export type MyContext = {
  req: Request & { session: Session };
  res: Response;
};
