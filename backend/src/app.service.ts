import { Injectable, OnModuleInit } from '@nestjs/common';
import { SocketService } from './socket/socket.service';
import { RmqService } from './modules/rmq/rmq.service';
import { Channel } from 'amqplib';

@Injectable()
export class AppService implements OnModuleInit {
  ch!: Channel;
  constructor(
    private readonly socketService: SocketService,
    private readonly rmqService: RmqService,
  ) {}
  async onModuleInit() {
    const ch = await this.rmqService.connection.createChannel();
    ch.assertExchange('socket_event', 'fanout', { durable: false });
    this.ch = ch;
    const { queue } = await ch.assertQueue('', { exclusive: true });
    ch.bindQueue(queue, 'socket_event', '');
    ch.consume(queue, (msg) => {
      if (msg) {
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
    });

    setInterval(() => {
      this.ch.publish(
        'socket_event',
        '',
        Buffer.from('Hello world from backend 1!'),
      );
    }, 1000);
  }
  getHello() {
    return this.ch.publish('socket_event', '', Buffer.from('Hello world!'));
  }
}
