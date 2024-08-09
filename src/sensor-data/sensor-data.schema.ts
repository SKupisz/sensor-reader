import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorDataDocument = SensorData & Document;

@Schema()
export class SensorData {
    @Prop({ required: true })
    timestamp: string;

    @Prop({ required: true })
    clientId: string;
    
    @Prop({ required: true })
    temperature: number;
    
    @Prop({ required: true })
    humidity: number;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);