import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@config';

export const createToken = async (payload: object, expiresIn: string) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn,
    algorithm: 'HS256',
  });

  return token;
};

export const jwtVerify = async (token: string) =>
  new Promise(resolve => {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return resolve(err);
      }
      return resolve(decoded);
    });
  });
