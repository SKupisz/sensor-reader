
export type Sensor = {
    temperature: number;
    humidity: number;
}

export type MongoDBSensorData = {
    clientId: string;
    timestamp: string;
    temperature: number;
    humidity: number;
}