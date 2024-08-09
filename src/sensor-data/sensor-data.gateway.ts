import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { MongoDBSensorData } from './sensor-data.dto';

@WebSocketGateway(80, {transports: ['websocket']})
export class SensorDataGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  private logger:Logger = new Logger(SensorDataGateway.name);

  constructor(private readonly sensorService: SensorDataService){

  }
  
  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: string): Promise<MongoDBSensorData> {
    
    try {
      const payload = JSON.parse(data);

      if(typeof payload.temperature !== 'number' || typeof payload.humidity !== 'number') {
        this.server.emit('message', { error: {message: 'Invalid format of the data. Both the temperature and the humidity should be numbers' }});
        return;
      }
  
      const sensorData:MongoDBSensorData = {
        clientId: client.id,
        timestamp: new Date().toISOString(),
        temperature: payload.temperature,
        humidity: payload.humidity,
      }
  
      try {
        const savingResult = await this.sensorService.writeToDB(sensorData);
        this.server.emit('message', savingResult);
      } catch (error) {
        client.emit('error', {message: 'Failed to save the data in the database'});
        this.logger.error(`Failed to save the data in the MongoDB with the following error: ${error.message}`);
      }
    }
    catch {
      this.server.emit('message', { error: {message: 'Invalid format of the data. Both the temperature and the humidity should be numbers' }});
    }
    return;
  }

  afterInit(server: Server) {
    this.logger.log('Server initialized, listening at port 80');
    this.server = server;
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Sensor ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Sensor ${client.id} disconnected`);
  }
}
