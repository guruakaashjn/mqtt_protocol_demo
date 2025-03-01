import express from "express";
import connect from "./db/connect.js";
import dotenv from "dotenv";
import airPurifierRoute from "./routes/airPurifierRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/v1/air-purifier', airPurifierRoute);
app.all('*', (req, res) => {
    res.status(404).json({ "error": "Page not found" });
});
app.use((err, req, res, next) => {
    app.status(500).json({
        "error": "Internal server error",
        "message": err.message
    });
});

const server = async () => {
    try {
        console.log("Starting to run the Server...");
        await connect();
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server is running on port ${process.env.SERVER_PORT}`);
        });
    } catch (error) {
        console.log("Server start unsuccessful!", error);
        process.exit(1);
    }
}

server();

