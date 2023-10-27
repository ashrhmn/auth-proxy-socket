import { Injectable, OnModuleInit } from '@nestjs/common';
import { RmqService } from './rmq/rmq.service';
import { SocketService } from './socket/socket.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly rmqService: RmqService,
    private readonly socketService: SocketService,
  ) {}

  async onModuleInit() {
    const ch = await this.rmqService.connection.createChannel();
    ch.assertExchange('socket_event', 'fanout', { durable: false });

    setInterval(() => {
      ch.publish(
        'socket_event',
        '',
        Buffer.from('Hello world from backend 2!'),
      );
    }, 1000);

    const { queue } = await ch.assertQueue('', { exclusive: true });
    ch.bindQueue(queue, 'socket_event', '');
    ch.consume(queue, (msg) => {
      if (msg) {
        console.log(
          `[x] Received on ${new Date().toString()} : `,
          msg.content.toString(),
        );
        this.socketService.emit('message', msg.content.toString());
      }
    });
  }
  getHello(): string {
    return 'Hello World!';
  }
}
