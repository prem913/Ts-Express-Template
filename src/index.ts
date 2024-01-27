import express from "express";
import { PORT } from "./config";
import expressApp from "./express-app";
import http from "http";
import connectDB from "./database";

const StartServer = async() => {

    const app = express();
    
    await connectDB().catch(console.error);
    
    await expressApp(app);

    const server = http.createServer(app);

    server.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
      })
    .on("error", (err) => {
        console.error(err);
        process.exit();
    });
};

StartServer();