import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal Server Error";
  let error = err;



  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid or missing fields in request";
  }

  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        statusCode = 404;
        message = "Requested resource not found";
        break;

      case "P2002":
        statusCode = 409;
        message = "Duplicate record already exists";
        break;

      case "P2003":
        statusCode = 400;
        message = "Invalid relation or foreign key";
        break;

      default:
        statusCode = 400;
        message = "Database request failed";
    }
  }

  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown database error occurred";
  }

  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      message = "Database authentication failed";
    } else if (err.errorCode === "P1001") {
      statusCode = 503;
      message = "Database server unreachable";
    }
  }



  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }



  else if (err.status && err.message) {
    statusCode = err.status;
    message = err.message;
  }

 

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
}

export default errorHandler;
