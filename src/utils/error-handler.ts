import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "./app-error";

import { createLogger, transports } from "winston";

const LogErrors = createLogger({
  transports: [new transports.Console(), new transports.File({ filename: "app_error.log" })],
});

class ErrorLogger {
  async logError(err: Error) {
    LogErrors.log({
      private: true,
      level: "error",
      message: `${new Date()}-${JSON.stringify(err)}`,
    });
    return false;
  }
}

const ErrorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorLogger = new ErrorLogger();
  const devEnvironment = process.env.NODE_ENV === "development";
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, error: err.errorDescription, stack: devEnvironment ? err.stack : null });
  } else {
    await errorLogger.logError(err);
  }
  next();
};

export default ErrorHandler;

// process.on('uncaughtException', (reason, promise) => {
//     console.log(reason, 'UNHANDLED');
//     throw reason; // need to take care
// })

// process.on('uncaughtException', (error) => {
//     errorLogger.logError(error);
//     if(errorLogger.isTrustError(err)){
//         //process exist // need restart
//     }
// })

// console.log(err.description, '-------> DESCRIPTION')
// console.log(err.message, '-------> MESSAGE')
// console.log(err.name, '-------> NAME')
