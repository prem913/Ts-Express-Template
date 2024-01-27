import dotEnv from "dotenv";

dotEnv.config();
export const  PORT =  process.env.PORT;
export const APP_SECRET = process.env.APP_SECRET || "secret";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

