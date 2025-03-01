### This is a simple demonstration of how the Air Purifier communicates with the system via MQTT protocol.

## **MQTT protocol**

**What is MQTT protocol**

- MQTT stands for Message Queuing Telemetry Transport, its a simple, lightweight messaging protocol used to establish communication between multiple devices.Its often used for Internet of Things (IoT) devices like smart sensors and variables.
- MQTT works on Publish-Subscribe Model

**What are the main components of publish-subscribe model**

- Two Main components of MQTT Protocol are :-
  1. MQTT Client
  - It can be both Publisher and Subscriber
  - Client publishes or subscribes messages on different topics to brokers.
  2. MQTT Publisher
  - It is the heart of the publish/subscribe protocol.
  - Is is the central server that receives messages and filters them based on their topics. It then sends these messages to respective clients that have subscribed to those different topics.

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
