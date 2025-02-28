// Initial fan speed of the IOT device
let fanSpeed = 0;

// Generate random sensor data between 1-100, for air purifier vitals
export function generateSensorData() {
    return {
        temperature: Math.floor(Math.random() * 100) + 1,
        humidity: Math.floor(Math.random() * 100) + 1,
        pm_level: Math.floor(Math.random() * 100) + 1,
    };
}

export function setFanSpeed(message) {
    let sensorData = JSON.parse(message);
    // Some random logic to set new fan speed
    if ((sensorData.temperature + sensorData.humidity + sensorData.pm_level) >= 150) {
        const newFanSpeedData = { fanSpeed: 100 };
        return newFanSpeedData;
    } else {
        const newFanSpeedData = { fanSpeed: 50 };
        return newFanSpeedData;
    }
}