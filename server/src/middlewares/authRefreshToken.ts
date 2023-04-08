import User from "../models/User";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { User as UserType } from "../types/auth";
import RefreshToken from "../models/RefreshToken";
import { config } from "../config/config";

declare global {
  namespace Express {
    export interface Request {
      auth: {
        user: UserType;
        token: string;
        token_id?: string;
      };
    }
  }
}

export default async function authRefreshToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return response.status(401).json({ message: "unauthorized" });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: "unauthorized" });
  }

  try {
    const { _id } = jwt.verify(token, config.REFRESH_SECRET) as { _id: string };

    let refreshToken = await RefreshToken.findOne(
      { token },
      {
        match: {
          token,
        },
      }
    );

    if (!refreshToken) {
      throw Error("Token not found");
    }

    let user = await User.findOne({ _id }).populate({
      path: "refreshTokens",
      match: {
        token,
      },
    });

    if (!user) {
      throw Error("User not found");
    }

    if (!user.refreshTokens.length) {
      throw Error("Token Not Found");
    }

    refreshToken = refreshToken.toObject();

    let userObject = user.toObject() as UserType & {
      password?: string;
      refreshTokens?: string[];
    };

    delete userObject.password;
    delete userObject.refreshTokens;

    request.auth = {
      user: userObject,
      token,
      token_id: refreshToken._id.toJSON(),
    };

    next();
  } catch (err) {
    return response.status(401).json({ message: "unauthorized" });
  }
}