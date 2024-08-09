import { Test, TestingModule } from '@nestjs/testing';
import { SensorDataGateway } from './sensor-data.gateway';
import { SensorDataService } from './sensor-data.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

describe('SensorDataGateway', () => {
  let gateway: SensorDataGateway;
  let sensorDataService: SensorDataService;
  let client:Socket;
  let server:Server;
  let logger:Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorDataGateway, {
        provide: SensorDataService,
        useValue: {
          writeToDB: jest.fn(),
        }
      }],
    }).compile();

    gateway = module.get<SensorDataGateway>(SensorDataGateway);

    client = {
      emit: jest.fn(),
    } as any as Socket;

    server = {
      emit: jest.fn(),
      error: jest.fn(),
    } as any as Server;

    gateway.server = server;

    logger = {
      log: jest.fn()
    } as any as Logger;

    Reflect.set(gateway, 'logger', logger);

    sensorDataService = module.get<SensorDataService>(SensorDataService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('can handle the socket connection', () => {
    gateway.handleConnection(client);

    expect(logger.log).toHaveBeenCalled();
  });

  it('can handle the socket disconnection', () => {
    gateway.handleDisconnect(client);

    expect(logger.log).toHaveBeenCalled();
  });

  it('should call the writeToDB method in case everything is okay with the data arriving', async () => {
    const payload = {
      temperature: 40,
      humidity: 30
    };

    await gateway.handleMessage(client, JSON.stringify(payload));
    expect(server.emit).toHaveBeenCalled();
    expect(sensorDataService.writeToDB).toHaveBeenCalled();
  });

  it('throws an error in case of the wrong payload', async () => {
    const payload = {
      temperature: 'loremIpsum',
      humidity: 40
    };

    await gateway.handleMessage(client, JSON.stringify(payload));

    expect(sensorDataService.writeToDB).not.toHaveBeenCalled();
    expect(server.emit).toHaveBeenCalledWith("message", {"error": {"message": "Invalid format of the data. Both the temperature and the humidity should be numbers"}});
  });
});
