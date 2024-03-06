import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/appError';

export const whiteListUrlQuery =
  (whiteList: Array<string>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const unAllowedQueryParams = Object.keys(query).filter(
      (field) => !whiteList.includes(field)
    );

    if (unAllowedQueryParams.length > 0) {
      return next(
        new AppError(
          `You provided a query param that is not allowed. The query you provided that is not correct is: ${unAllowedQueryParams.join(
            ' ;'
          )}, please try again after you fix the query`,
          400
        )
      );
    }
    next();
  };

export const allowCors = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Set-Cookie'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

export default { whiteListUrlQuery, allowCors };
