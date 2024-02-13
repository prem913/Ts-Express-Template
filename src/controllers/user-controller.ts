import { type Request, type Response } from "express";
import {z} from "zod";
import { APIError, ValidationError } from "../utils/app-error";
import { GenerateSignature, ValidateRequest } from "../utils/auth_utils";
import { createUser, getUserByEmail,getUserByUsername } from "../db/users";
import { APP_SECRET, REFRESH_TOKEN_SECRET } from "../config";

// SIGNUP
const SignupSchema = z.object({
  email: z.string({
    required_error: "Email is required"
  }),
  username: z.string({
    required_error: "Username is required",
  }).min(5,"username length mustbe greater than 5"),
  password: z.string({
    required_error: "password is required"
  }),
  confirm_password: z.string({
    required_error: "confirm password is required"
  }),
});
export const signUp = async (req: Request, res: Response) => {
  const validationResult = SignupSchema.safeParse(req.body);
  if (validationResult.success === false) {
    throw new ValidationError(
      "vaidation when signup request",
      validationResult.error
    );
  }
  const data = validationResult.data;
  if (data.password !== data.confirm_password) {
    throw new ValidationError("password and confirm_password shold be same");
  }

  const username = await getUserByUsername(data.username);
  if (username !== null) {
    throw new ValidationError("Username already exists");
  }

  const email = await getUserByEmail(data.email);
  if(email !== null){
    throw new ValidationError("Email already exists");
  }

  const user = await createUser({
      username: data.username,
      password: data.password,
      email: data.email
    });
  res.status(200).json({
    message: "Signup successful",
    user,
  });
};

// SIGNIN
const SigninSchema = z.object({
  username: z.string({
    required_error: "Username is required"
  }),
  password: z.string({
    required_error: "Password is required"
  }),
});

export const signIn = async (req: Request, res: Response) => {
  const validationResult = SigninSchema.safeParse(req.body);
  if (validationResult.success === false) {
    throw new ValidationError(
      "Validation Error",
      validationResult.error
    );
  }
  const data = validationResult.data;
  // check if user exists
  const user = await getUserByUsername(data.username).lean();
  if (user === null) {
    throw new ValidationError("User not found");
  }
  if (user.password !== data.password) {
    throw new ValidationError("Incorrect password");
  }
  const token = GenerateSignature(user,APP_SECRET);
  const refreshToken = GenerateSignature(user,REFRESH_TOKEN_SECRET);
  if(!token) throw new APIError("JWT Error");
  res.status(200).json({
    message: "Signin successful",
    "token" : token,
    "refreshToken" : refreshToken
  });
};

export const refreshToken = async (req: Request, res: Response) =>{
  const isAuthorized = await ValidateRequest(req,REFRESH_TOKEN_SECRET);
  if(!isAuthorized){
    throw new ValidationError("Refresh Token is Expired or Invalid!");
  }
  const token = GenerateSignature(req.user,APP_SECRET);
  const refreshToken = GenerateSignature(req.user,REFRESH_TOKEN_SECRET);
  res.json({
    "accessToken" : token,
    "refreshToken" : refreshToken
  });
};

export const getUser = async (req: Request,res: Response) =>{
  res.status(200).json({user:req.user});
};
// export async function getUserDetails(req: Request, res: Response) {
//   const username = req.user.username;
//   const user = await prisma.user.findUnique({
//     where:{
//       username
//     },
//     select:{
//       username:true,
//       email:true,
//       createdAt:true,
//       Profile:true
//     }
//   })
//   res.status(200).json({
//     message:"User details fetched successfully",
//     username:user?.username,
//     email:user?.email,
//     createdAt:user?.createdAt,
//     ...user?.Profile
//   })
// }
