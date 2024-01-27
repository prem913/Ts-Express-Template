import { type NextFunction, type Request, type Response } from "express";
import { ValidateRequest } from "../utils/auth_utils";
import { ValidationError } from "../utils/app-error";

export default async (req:Request,res:Response,next:NextFunction) => {
    
    const isAuthorized = await ValidateRequest(req);

    if(isAuthorized){
        next();
        return;
    }
    throw new ValidationError("Token Expired or Invalid!");
};