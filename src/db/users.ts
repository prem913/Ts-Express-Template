
import {model,type ObjectId,Schema} from "mongoose";

export interface IUser {
    username : string
    email : string
    password : string
    role? : "general" | "moderator" | "admin"
    isEmailVerified? : boolean
} 

const userSchema = new Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      
      role: {
        type: String,
        enum: ["general", "moderator", "admin"],
        default: "general",
      },
  
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
export const userModel = model<IUser>("User",userSchema);

export const getAllUsers = () => userModel.find();

export const  getUserById = (id : string | ObjectId) => userModel.findById(id);

export const getUserByEmail = (email : string) => userModel.findOne({email : email});

export const getUserByUsername = (username: string) => userModel.findOne({username : username});

export const createUser = (data : IUser) => userModel.create(data);