import mqtt from 'mqtt';
import { generateSensorData, setFanSpeed } from './service/mqttService.js';

// MQTT Broker configs
const BROKER_URL = 'mqtt://broker.hivemq.com';
const SENSOR_TOPIC = 'airpurifier/sensors';
const FAN_SPEED_TOPIC = 'airpurifier/fan/set';
const FAN_SPEED_ACK_TOPIC = 'airpurifier/fan/ack';
// const publishOptions = { retain: false, qos: 1 };

// MQTT Broker connection
// client 1 sends the sensor data parameters, listenes to fan speed commands, and 
// sends fan speed acknowledgement commands.
// client 2 listens to sensor data parameters and sends fan speed commands.
const client1 = mqtt.connect(BROKER_URL, { clientId: "1" });
const client2 = mqtt.connect(BROKER_URL, { clientId: "2" });


// Publish sensor data every 2 minutes (2*60*1000 = 120000 ms)
function publishSensorData() {
    const sensorData = generateSensorData();

    client1.publish(SENSOR_TOPIC, JSON.stringify(sensorData));
    console.log(`Published sensor data: ${JSON.stringify(sensorData)}`);
}

client1.on('connect', () => {
    console.log('Client 1 Connected to MQTT broker');
    // Start publishing sensor data topic, every 2 mins
    // setInterval(publishSensorData, 120000);
    setInterval(publishSensorData, 20000);

    // Listenes to fan speed ack topic
    client1.subscribe(FAN_SPEED_TOPIC, () => {
        console.log(`Client 1 Subscribed to topic: ${FAN_SPEED_TOPIC}`);
    });
});

client2.on('connect', () => {
    console.log('Client 2 Connected to MQTT broker');

    // Listen to fan speed topic
    client2.subscribe(SENSOR_TOPIC, () => {
        console.log(`Client 2 Subscribed to topic: ${SENSOR_TOPIC}`);
    });
});

client1.on('message', (topic, message) => {
    if (topic === FAN_SPEED_TOPIC) {
        let newFanSpeedData = JSON.parse(message);
        let fanSpeed = newFanSpeedData.fanSpeed;
        client1.publish(FAN_SPEED_ACK_TOPIC, JSON.stringify({ status: 'success', fanSpeed: fanSpeed }));
        console.log(`Client 1 published ${FAN_SPEED_ACK_TOPIC}`);
        console.log(`New fan speed ${JSON.stringify(newFanSpeedData)}`);
    }
});

client2.on('message', (topic, message) => {
    if (topic === SENSOR_TOPIC) {
        const newFanSpeedData = setFanSpeed(message);
        client2.publish(FAN_SPEED_TOPIC, JSON.stringify(newFanSpeedData));
        console.log(`Client 2 published topic ${FAN_SPEED_TOPIC}`);
    }
});

// Handle errors (if incase)
client1.on('error', (err) => {
    console.log(`Client 1 MQTT Error: ${err}`);
});

client2.on('error', (err) => {
    console.log(`Client 2 MQTT Error: ${err}`);
});