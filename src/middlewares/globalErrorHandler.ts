import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = "Internal Server Error";
  let details = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid or missing fields in request";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2002":
        statusCode = 409;
        message = "Duplicate record exists";
        break;
      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;
      default:
        statusCode = 400;
        message = "Database request error";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown database error";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    switch (err.errorCode) {
      case "P1000":
        statusCode = 401;
        message = "Database authentication failed";
        break;
      case "P1001":
        statusCode = 503;
        message = "Database unreachable";
        break;
      default:
        statusCode = 500;
        message = "Database initialization error";
    }
  }

  // Auth & Role errors
  else if (err instanceof ApiError) {
    statusCode = err.status;
    message = err.message;
  }

  // Node fetch API request errors
  else if (err.name === "FetchError") {
    statusCode = 502;
    message = "External API request failed";
  }

  // JWT token errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Sequelize / Prisma-like raw errors
  else if (err.code && err.code.startsWith("SQL")) {
    statusCode = 400;
    message = "Database query error";
  }

  // Catch-all for custom errors thrown as objects
  else if (err.status && err.message) {
    statusCode = err.status;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
  });
}

export { errorHandler, ApiError };
