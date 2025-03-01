import SensorData from "../models/SensorDataModel.js";
import { BROKER_URL, SENSOR_TOPIC } from "../mqttConfiguration/mqttConfigs.js"
import mqtt from "mqtt";

const client = mqtt.connect(BROKER_URL);

client.on('connect', () => {
    console.log('Connected to MMQTT broker');
    client.subscribe(SENSOR_TOPIC);
});

client.on('message', async (topic, message) => {
    if (topic === SENSOR_TOPIC) {
        const sensorData = JSON.parse(message.toString());
        await SensorData.create(sensorData);
        console.log('Stored sensor data: ', sensorData);
    }
});

export default client;

