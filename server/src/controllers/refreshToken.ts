import { Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { User } from '../entities/User';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateToken';
import { setRefreshToken } from '../utils/setRefreshToken';

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.jid;
  if (!refreshToken) return res.send({ success: false, accessToken: '' });

  try {
    const payload = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as JwtPayload;

    const user = await User.findOne({ id: payload.userID });

    if (!user) return res.send({ success: false, accessToken: '' });

    if (user.tokenVersion !== payload.tokenVersion)
      return res.send({ success: false, accessToken: '' });

    const accessToken = generateAccessToken(user);

    setRefreshToken(res, generateRefreshToken(user));

    return res.send({ success: true, accessToken });
  } catch (err) {
    return res.send({ success: false, accessToken: '' });
  }
};
