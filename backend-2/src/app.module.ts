import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [SocketModule, RmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
