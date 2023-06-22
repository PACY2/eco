import { HttpException } from "@src/exceptions";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: any,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (error instanceof HttpException) {
    return response.status(error.statusCode).json(error.getBody());
  }

  const statusCode = 500;

  return response.status(statusCode).json({
    statusCode,
    content: error,
    error: "Internal Server Error",
  });
};
