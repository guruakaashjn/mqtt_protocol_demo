import Schedule from "../models/ScheduleModel.js";
import cronJob from "node-cron";
import client from "../client/client.js";
import { FAN_SPEED_TOPIC } from "../mqttConfiguration/mqttConfigs.js";

export const scheduleService = async (day, startTime, endTime, fanSpeed) => {
    await Schedule.create({ day, startTime, endTime, fanSpeed });

    let cronExpression = convertTimeAndDayToCronExpression(startTime, day);
    cronJob.schedule(cronExpression, () => {
        client.publish(FAN_SPEED_TOPIC, JSON.stringify({ fanSpeed }));
        console.log(`Published Set Fan Speed Topic ${JSON.stringify({ fanSpeed })}`);
        console.log(`Sent fan speed ${fanSpeed} at ${startTime}`);
    });

    cronExpression = convertTimeAndDayToCronExpression(endTime, day);
    cronJob.schedule(cronExpression, () => {
        client.publish(FAN_SPEED_TOPIC, JSON.stringify({ fanSpeed: 0 }));
        console.log(`Published Set Fan Speed Topic ${JSON.stringify({ fanSpeed: 0 })}`);
        console.log(`Turned off fan at ${endTime}`);
    });
}

export const preCleanService = async (fanMode, duration) => {
    const fanSpeed = setFanSpeedBasedOnFanMode(fanMode);

    client.publish(FAN_SPEED_TOPIC, JSON.stringify({ fanSpeed: fanSpeed }));
    console.log(`Published Set Fan Speed Topic ${JSON.stringify({ fanSpeed })}`);
    console.log(`Pre-clean started with fan mode ${fanMode}, fan speed set to ${fanSpeed}`);

    setTimeout(() => {
        client.publish(FAN_SPEED_TOPIC, JSON.stringify({ fanSpeed: 0 }));
        console.log(`Published Set Fan Speed Topic ${JSON.stringify({ fanSpeed: 0 })}`);
        console.log('Pre-cleaning completed, fan turned off');
    }, duration * 1000);
}

function setFanSpeedBasedOnFanMode(fanMode) {
    if (fanMode == 'active')
        return 100;
    if (fanMode == 'normal')
        return 50;
    return 0;
}

function convertTimeAndDayToCronExpression(time, day) {
    // Map of day names to cron-compatible numbers
    const daysMap = {
        "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6
    };

    // validate and convert day
    const cronDay = daysMap[ day ];
    if (cronDay === undefined) {
        throw new Error("Invalid day name. Use full names like 'Monday'.");
    }

    // Validate and extract hour & minute from time string
    const timeParts = time.match(/^(\d{2}):(\d{2})$/);
    if (!timeParts) {
        throw new Error("Invalid time format. Use 'HH:MM' (24-hour format).");
    }

    const hour = parseInt(timeParts[ 1 ], 10);
    const minute = parseInt(timeParts[ 2 ], 10);

    // Ensure valid hour and minutes ranges
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        throw new Error("Invalid time values. Hour must be 0-23, minute must be 0-59.");
    }

    // Generate CRON expression
    return `${minute} ${hour} * * ${cronDay}`;
}