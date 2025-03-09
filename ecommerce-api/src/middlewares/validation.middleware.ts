import { RequestHandler } from 'express';
import { cleanObj, generalResponse, responseTypeEnum } from '../helper/common.helper';

interface Error {
  message: string;
  path: Object;
  type: string;
  context: any;
}

const errorFilterValidator = (error: Array<Error>) => {
  const extractedErrors: Array<string> = [];
  error.forEach((err: Error) => extractedErrors.push(err.message));
  const errorResponse = extractedErrors.join(', ');
  return errorResponse;
};

type RequestFields = 'body' | 'query' | 'params';

const validationMiddleware = (type: any, value: RequestFields = 'body'): RequestHandler => {
  return async (req, res, next) => {
    try {
      cleanObj(req[value]);
      req[value] = await type.validateAsync(req[value]);
      next();
    } catch (e) {
      const error: any = e;
      if (error.details) {
        const errorResponse = errorFilterValidator(error.details);
        return generalResponse(res, null, errorResponse, responseTypeEnum.ERROR, true, 400);
      }
      return generalResponse(res, null, 'Something went wrong!', responseTypeEnum.SUCCESS, true, 400);
    }
  };
};
export default validationMiddleware;
