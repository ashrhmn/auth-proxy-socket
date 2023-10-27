import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'express-http-proxy';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { NextFunction, Request, Response } from 'express';
// import { parse } from 'url';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    // console.log('innnnnnnnn ', req.baseUrl, req.originalUrl);
    // if (req.baseUrl === '/about') {
    //   // res.cookie('test', Math.random().toString(), { httpOnly: true });
    //   res.setHeader('test', Math.random().toString());
    // }
    proxy('http://localhost:3000/', {
      // proxyReqPathResolver: async (req) => {
      //   // const url = parse(req.url, true);
      //   // url.query.data = Math.random().toString();
      //   // console.log(req.originalUrl, req.baseUrl);
      //   if (!['/', '/about', ''].includes(req.baseUrl)) return req.originalUrl;
      //   const data = Math.random().toString();
      //   console.log(data);
      //   return req.originalUrl.includes('?')
      //     ? `${req.originalUrl}&data=${data}`
      //     : `${req.originalUrl}?data=${data}`;
      // },
      proxyReqPathResolver: (req) => req.originalUrl,
      filter: (req) =>
        req.method === 'GET' &&
        !['/api', '/static'].some((path) => req.baseUrl.startsWith(path)),
      timeout: 5000,
    })(req, res, next);
  });
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'static'), { prefix: '/static/' });
  app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  app.setViewEngine('hbs');
  await app.listen(4000);
}
bootstrap();
