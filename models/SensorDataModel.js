import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    pmLevel: Number,
    fanSpeed: Number,
}, { timestamps: true });

const SensorData = mongoose.model("SensorData", sensorDataSchema);

export default SensorData;