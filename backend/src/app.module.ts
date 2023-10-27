import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './modules/user/user.module';
import { DataMiddleware } from './middlewares/data.middleware';
import { RmqModule } from './modules/rmq/rmq.module';

@Module({
  imports: [SocketModule, UserModule, RmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DataMiddleware).forRoutes('*');
  }
}
