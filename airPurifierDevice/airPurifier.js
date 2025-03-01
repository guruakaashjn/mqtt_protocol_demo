import mqtt from "mqtt";
import airPurifierObject from "./airPurifierObject.js";

// MQTT Broker configurations
const BROKER_URL = 'mqtt://mqtt.eclipseprojects.io';
const SENSOR_TOPIC = 'iot/airpurifier/sensors';
const FAN_SPEED_TOPIC = 'iot/airpurifier/fan/set';
const FAN_SPEED_ACK_TOPIC = 'iot/airpurifier/fan/ack'

// Connect AirPurifier Client to MQTT Broker
const airPurifierClient = mqtt.connect(BROKER_URL);

airPurifierClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    airPurifierClient.subscribe(FAN_SPEED_TOPIC, (err) => {
        if (!err) {
            console.log(`Subscribed to ${FAN_SPEED_TOPIC}`);
        }
    });

    setInterval(() => {
        const sensorData = {
            temperature: Math.floor(Math.random() * 100) + 1,
            humidity: Math.floor(Math.random() * 100) + 1,
            pmLevel: Math.floor(Math.random() * 100) + 1,
        };
        sensorData.fanSpeed = airPurifierObject.fanSpeed;

        airPurifierClient.publish(SENSOR_TOPIC, JSON.stringify(sensorData));
        console.log('Published Sensor Data Topic: ', sensorData);
    }, 120000);
});

airPurifierClient.on('message', (topic, message) => {
    if (topic === FAN_SPEED_TOPIC) {
        const command = JSON.parse(message.toString());
        if (command.fanSpeed !== undefined) {
            airPurifierObject.fanSpeed = command.fanSpeed;
            const fanSpeed = airPurifierObject.fanSpeed;
            console.log(`Updated fan speed to ${fanSpeed}`);

            airPurifierObject.powerOn = airPurifierObject.fanSpeed > 0 ? true : false;
            if (airPurifierObject.fanSpeed == 100)
                airPurifierObject.mode = "active";
            else if (airPurifierObject.fanSpeed == 50)
                airPurifierObject.mode = "normal";
            else
                airPurifierObject.mode = "default";

            // Send fan speed topic acknowledgement, after listening and successful fan speed topic execution.
            const ackMessage = { status: 'success', fanSpeed };
            airPurifierClient.publish(FAN_SPEED_ACK_TOPIC, JSON.stringify(ackMessage));
            console.log('Published Set Fan Speed Acknowledgement Topic: ', ackMessage);
            console.log(`Air Purifier State: ${JSON.stringify(airPurifierObject)}`)
        }
    }
});

airPurifierClient.on('error', (err) => {
    console.log(`Client MQTT Error: ${err}`);
});
