import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';
import { generalResponse, responseTypeEnum } from '../helper/common.helper';
import { COMMON_MESSAGES } from '../messages/common.messages';
import { logger } from '../utils/logger';


const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof HttpException) {
    const status: number = error.status || 500;
    const message: string = error.message || COMMON_MESSAGES.SOMETHING_WRONG;
    const data: any = error.data || {};
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    return generalResponse(res, data, message, responseTypeEnum.ERROR, true, status);
  }
  return generalResponse(res, error.stack, COMMON_MESSAGES.SOMETHING_WRONG, responseTypeEnum.ERROR, true, 500);
};


export default errorMiddleware;
