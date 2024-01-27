import "express-async-errors";
import express,{type Express} from "express";
import cors from "cors";
import userRouter from "./routes/user-route";
import HandleErrors from "./utils/error-handler";
import { logRequest } from "./utils/console_utils";


const expressApp =  async (app:Express) => {
    // middlewares
    app.use(express.json({ limit: "1mb"}));
    app.use(express.urlencoded({ extended: true, limit: "1mb"}));
    app.use(cors({
        credentials: true
    }));
    // app.use(compression())
    app.use(express.static("public"));

    // routes
    app.use((req,res,next) =>{
        logRequest(req.method,req.url,req.body);
        next();
    });
    app.use("/user",userRouter);
    app.get("/",(req,res)=>{
        res.status(200).send("hello world!");
    });
    
    // error handling
    app.use(HandleErrors);
};

export default expressApp;