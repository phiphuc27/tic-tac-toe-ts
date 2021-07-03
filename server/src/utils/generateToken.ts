import { sign } from 'jsonwebtoken';
import { User } from '../entities/User';

export const generateAccessToken = (user: User) => {
  return sign({ userID: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (user: User) => {
  return sign({ userID: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};
