import { Response } from 'express';
import { COOKIE_NAME, __prod__ } from '../constants';

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: __prod__,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7day
    path: '/refresh_token',
  });
};
