# Air Purifier Demo

### Demonstration of Air Purifier's communication with the system via MQTT protocol.

## **MQTT protocol**

**What is MQTT protocol**

- MQTT stands for Message Queuing Telemetry Transport, its a simple, lightweight messaging protocol used to establish communication between multiple devices.Its often used for Internet of Things (IoT) devices like smart sensors and variables.
- MQTT works on Publish-Subscribe Model

**What are the main components of publish-subscribe model**

- Two Main components of MQTT Protocol are :-
  1. MQTT Client
     - It can be both Publisher and Subscriber.
     - Client publishes or subscribes messages on different topics to brokers.
  2. MQTT Publisher
     - It is the heart of the publish/subscribe protocol.
     - Is is the central server that receives messages and filters them based on their topics. It then sends these messages to respective clients that have subscribed to those different topics.

## **Project installation and setup**

**1. Install NodeJS from here [NodeJS official](https://nodejs.org/en/download)**

**2. Install MongoDB from here [MongoDB official](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)**

**3. Clone the repository**

```
git clone https://github.com/guruakaashjn/mqtt_protocol_demo.git
```

**4. Install all the required NodeJS libraries for this project**

```
npm i
```

## **Steps to run the server**

**1. Open new terminal window**

**2. Move inside the root folder**

```
cd mqtt_protocol_demo
```

**3. Start the development server**

```
npm run start
```

## **Steps to simulate the Air Purifier**

**1. Open new terminal window**
**2. Move inside the air purifier device folder**

```
cd airPurifierDevice
```

**3. Run the Air Purifier simulator by runnig the below command**

```
node airPurifier.js
```

## **Features of the project**

- Public Free Message Broker used for the demonstration purposes only.

  - `mqtt://mqtt.eclipseprojects.io`

- MQTT Topics used in the project are :-
  - `iot/airpurifier/sensors`
    - The air purifier publishes essential sensor data (temperature, humidity, pm level, current fan speed) to the MQTT broker.
    - The Backend System subscribes and listens to this topic and creates a new record in the MongoDB database.
  - `iot/airpurifier/fan/set`
    - The Backend System publishes the required fan speed at the desired day and time.
    - The air purifier subscribes and listens to this topic and sets its fan speed to the received fan speed.
  - `iot/airpurifier/fan/ack`
    - The air purifier upon listening to the `iot/airpurifier/fan/set` topic, sends an acknowledgement topic to the MQTT broker.
- Fan has 3 modes
  - `active` mode (sets fan speed to 100)
  - `normal` mode (sets fan speed to 50)
  - `default` mode (sets fan speed to 0)
- Fan power on functionality
  - If fan speed is greater then 0, the fan is switched on.
  - Else it is switched off.

## **APIs used**

1. To schedule the air purifier to run and stop the fan at their respective times.

   - **Effects**

     - It will schedule a CRON Job which will trigger the `iot/airpurifier/fan/set` topic on the scheduled start date and time, with given fan speed and fan is switched on.
     - It will schedule another CRON Job which will trigger the same `iot/airpurifier/fan/set` topic, but this time it is scheduled on the end date and time, with 0 fan speed and fan is switched off.

   - **API**

     ```
     http://127.0.0.1:3000/api/v1/air-purifier/schedule
     ```

   - **API Request**

     ```
     {
         "day": "Saturday",
         "startTime": "20:11",
         "endTime": "20:12",
         "fanSpeed": 95
     }
     ```

   - **API Response**

     ```
     {
         "status": "Scheduled successfully"
     }
     ```

2. To pre-clean the air purifier with any given fan mode

   - **Effects**

     - It will schedule a CRON Job which will trigger the `iot/airpurifier/fan/set` topic as soon as the API is hit, with the given fan mode (corresponding fan speed for the given fan mode is set) and fan is switched on.
     - After the duration, It will schedule another CRON Job which will trigger the same `iot/airpurifier/fan/set` topic, but this time with 0 fan speed and fan is switched off.

   - **API**

     ```
     http://127.0.0.1:3000/api/v1/air-purifier/pre-clean
     ```

   - **API Request**

     ```
     {
         "fanMode": "normal",
         "duration": 60
     }
     ```

   - **API Response**
     ```
     {
     "status": "Pre-cleaning started"
     }
     ```

## **Tech Stack used**

- NodeJS
- ExpressJS
- MongoDB
- VanillaJS
- MQTT protocol

## **Third party NPM libraries used**

- "dotenv": "^16.4.7"
- "express": "^4.21.2"
- "express-async-handler": "^1.2.0"
- "mongoose": "^8.11.0"
- "mqtt": "^5.10.4"
- "node-cron": "^3.0.3"
- "nodemon": "^3.1.9"

## **Contact Info**

**Developed with love by [J N Guru Akaash](https://github.com/guruakaashjn)**
