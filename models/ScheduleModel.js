import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    day: String,
    startTime: String,
    endTime: String,
    fanSpeed: Number,
}, { timestamps: true });


const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;