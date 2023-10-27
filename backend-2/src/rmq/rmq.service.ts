import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, connect } from 'amqplib';

@Injectable()
export class RmqService implements OnModuleInit {
  public connection!: Connection;
  async onModuleInit() {
    this.connection = await connect(
      process.env.RMQ_URL || 'amqp://ash:ash@192.168.64.24',
    );
  }
}
