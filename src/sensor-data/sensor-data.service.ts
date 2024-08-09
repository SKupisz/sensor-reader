import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SensorData, SensorDataDocument } from './sensor-data.schema';
import { Error, Model } from 'mongoose';

@Injectable()
export class SensorDataService {
    constructor(@InjectModel(SensorData.name) private sensorDataModel: Model<SensorDataDocument>){

    }

    async writeToDB(data: Partial<SensorData>): Promise<SensorData>{
        try {
            const createdSensor = new this.sensorDataModel(data);
            return createdSensor.save();
        } catch (error){
            throw new Error(error);
        }
    }
}
