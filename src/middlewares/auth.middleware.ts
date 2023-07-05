import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithInfo, TokenData } from '@interfaces/auth.interface';
import { jwtVerify } from '@/utils/jwt';

const authMiddleware = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
  try {
    const authorizationToken = req.header('Authorization');

    if (authorizationToken) {
      const verificationResponse = (await jwtVerify(authorizationToken)) as TokenData;
      let tokenData: DataStoredInToken;

      if (verificationResponse) {
        tokenData = Object.assign({}, tokenData, verificationResponse);
      }

      if (tokenData) {
        // TODO: Token validation logic

        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Missing authentication token '));
    }
  } catch (error) {
    console.log('Middleware Error: ', error);
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
