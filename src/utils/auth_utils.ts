import jwt, { type Secret } from "jsonwebtoken";

import bcrypt from "bcrypt";

import { APP_SECRET } from "../config";
import { type Request } from "express";
import { IUser } from "../db/users";
import { ReqUser } from "../custom";

declare global {
    namespace Express {
      interface Request {
        user: ReqUser
      }
    }
  }

// Utility functions
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password:string, salt:string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword:string,
  savedPassword:string,
  salt:string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload:IUser) : string | null => {
  try {
    return jwt.sign({
      username: payload.username,
      email: payload.email
    }, APP_SECRET as Secret, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const ValidateRequest = async (req:Request) => {
  try {
    const signature = req.get("Authorization");
    // console.log(signature?.split(" ")[1]);
    if(!signature) return false;
    const payload = jwt.verify(signature.split(" ")[1], APP_SECRET as Secret);
    req.user = payload as ReqUser;
    // console.log("user:",payload)
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
