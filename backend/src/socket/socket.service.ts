import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  cors: { origin: '*' },
  allowUpgrades: true,
})
export class SocketService {
  @WebSocketServer()
  server: Server;

  emit(event: string, data: any): boolean {
    return this.server.emit(event, data);
  }
}
