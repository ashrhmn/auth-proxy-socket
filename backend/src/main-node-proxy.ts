import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'http-proxy';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';
import { parse } from 'url';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  const proxyClient = proxy.createProxyServer({});
  proxyClient.on('error', (err, req, res) => {
    console.error('Error : ', err);
    res?.end(
      'Something went wrong. And we are reporting a custom error message.',
    );
  });
  app.use('/', (req: Request, res: Response) => {
    console.log(req.originalUrl);
    // if (req.originalUrl.startsWith('/api')) {
    //   return next();
    // } else {
    //   const { pathname, query } = parse(req.url, true);
    //   console.log({ pathname, query });
    //   return proxyClient.web(req, res, {
    //     target: `http://localhost:3000${req.originalUrl}`,
    //   });
    // }
    // next();
    if (req.method === 'GET')
      proxyClient.web(req, res, {
        target: `http://localhost:3000${req.originalUrl}`,
      });
  });
  app.setGlobalPrefix('api');
  // app.useStaticAssets(join(__dirname, '..', 'static'), { prefix: '/static/' });
  // app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  // app.setViewEngine('hbs');
  const server = await app.listen(4000);
  // server.on('upgrade', (req, socket, head) => {
  //   console.log('proxying ws', req.url);
  //   const { query, path, search } = parse(req.url!, true);
  //   proxyClient.ws(req, socket, head, {
  //     target: {
  //       query,
  //       path,
  //       search,
  //       host: 'localhost',
  //       port: 3000,
  //     },
  //   });
  // });
}
bootstrap();
