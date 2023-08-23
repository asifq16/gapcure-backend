import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const errorMessage: string = error.errorMessage || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${errorMessage}`);
    res.status(status).json({ errorCode: status, errorMessage });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
