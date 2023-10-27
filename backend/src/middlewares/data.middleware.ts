import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class DataMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('midddddddddd', req.baseUrl);
    return next();
  }
}
