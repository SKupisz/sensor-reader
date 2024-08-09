import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorDataGateway } from './sensor-data/sensor-data.gateway';
import { SensorDataService } from './sensor-data/sensor-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorData, SensorDataSchema } from './sensor-data/sensor-data.schema';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost/nest'), 
    MongooseModule.forFeature([{ name: SensorData.name, schema: SensorDataSchema }])],
  controllers: [AppController],
  providers: [AppService, SensorDataGateway, SensorDataService],
})
export class AppModule {}
