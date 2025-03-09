import { Response } from 'express';

export const enum responseTypeEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

export const generalResponse = (
  response: Response,
  data: any = null,
  message = '',
  responseType = responseTypeEnum.SUCCESS,
  toast = false,
  statusCode = 200,
) => {
  response.status(statusCode).send({
    data,
    message,
    toast,
    responseType,
  });
};
export const isNumeric = (n: any) => {
  return n && !isNaN(parseFloat(n)) && isFinite(n);
};

export const cleanObj = (obj: { [key: string]: any }) => {
  Object.keys(obj).forEach((key: string) => {
    try {
      if (obj[key] === '') {
        obj[key] = null;
      }
      if (!isNumeric(obj[key])) {
        obj[key] = JSON.parse(obj[key]);
      }
    } catch (err) {
      // do nothing
    }
  });
  return obj;
};

