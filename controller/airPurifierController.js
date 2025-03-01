import asyncHandler from "express-async-handler";

import { scheduleService, preCleanService } from "../service/airPurifierService.js";

const scheduleController = asyncHandler(async (req, res) => {
    const { day, startTime, endTime, fanSpeed } = req.body;
    await scheduleService(day, startTime, endTime, fanSpeed);

    res.status(200).json({ status: 'Scheduled successfully' });
});

const preCleanController = asyncHandler(async (req, res) => {
    const { fanMode, duration } = req.body;
    await preCleanService(fanMode, duration);

    res.status(200).json({ status: 'Pre-cleaning started' });
});

export { scheduleController, preCleanController }