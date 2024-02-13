import { type NextFunction, type Request, type Response } from "express";
import { ValidateRequest } from "../utils/auth_utils";
import { ValidationError } from "../utils/app-error";
import { APP_SECRET } from "../config";

export default async (req:Request,res:Response,next:NextFunction) => {
    
    const isAuthorized = await ValidateRequest(req,APP_SECRET);

    if(isAuthorized){
        next();
        return;
    }
    throw new ValidationError("Token Expired or Invalid!");
};