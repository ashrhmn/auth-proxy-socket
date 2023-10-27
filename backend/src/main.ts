import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'express-http-proxy';
import * as nodeProxy from 'http-proxy';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    proxy('http://localhost:3000/', {
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
  const server = await app.listen(4000);
  if (process.env.NODE_ENV === 'production') return;
  const proxyClient = nodeProxy.createProxyServer({});
  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/_next/webpack-hmr')
      proxyClient.ws(req, socket, head, {
        target: 'ws://localhost:3000',
      });
  });
}
bootstrap();
