import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { SensorDataService } from './sensor-data.service';
import { SensorData, SensorDataDocument, SensorDataSchema } from './sensor-data.schema';
import { Model } from 'mongoose';
import { MongoDBSensorData } from './sensor-data.dto';


describe('SensorService', () => {
  let service: SensorDataService;
  let mockSensorModel: Model<SensorDataDocument>;

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorDataService,
        {
          provide: getModelToken(SensorData.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<SensorDataService>(SensorDataService);
    mockSensorModel = module.get<Model<SensorDataDocument>>(getModelToken(SensorData.name));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /*

  it('should create a new sensor entry', async () => {

    const sensorData:MongoDBSensorData = {
      timestamp: '2024-08-09T00:00:00.000Z',
      clientId: 'sensor123',
      temperature: 25,
      humidity: 50,
    };

    const spy = jest
      .spyOn(mockSensorModel, 'create')
      .mockImplementation(jest.fn().mockResolvedValue(sensorData));
    const result = await service.writeToDB(sensorData);

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(sensorData);

  });

  it('should throw an error when saving fails', async () => {
    const sensorData:MongoDBSensorData = {
      timestamp: '2024-08-09T00:00:00.000Z',
      clientId: 'sensor123',
      temperature: 25,
      humidity: 50,
    };

    await expect(service.writeToDB(sensorData)).rejects.toThrow('Database operation failed');
  });

  */

});
