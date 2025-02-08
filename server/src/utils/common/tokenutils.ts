import { v4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";

import db from "../../db.js";

//types
import { Response } from "express";
import { generatetokentype, verifytokentype } from "./types";
import { usertype } from "../../models/resolvers/types/usertypes";

export const generateMagicToken = async (email: string): Promise<string> => {
  const token = v4();
  try {
    await db("magic_tokens").insert({
      email,
      token,
      expires_at: new Date(
        Date.now() + parseInt(process.env.MAGIC_TOKEN_EXPIRY!, 10)
      ), //default to 15m
    });
  } catch (err) {
    throw Error("Something went wrong while token creation");
  }

  return `http://localhost:3000/account/verify/${token}`;
};

export const generateTokens: generatetokentype = async (user: usertype) => {
  try {
    const accessToken: string = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY!, 10) }
    );

    const refreshToken: string = jwt.sign(
      { id: user.id },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY!, 10) }
    );

    await db("tokens")
      .insert({
        token: refreshToken,
        user_id: user.id,
      })
      .onConflict("user_id")
      .merge(["token"])
      .returning("*");

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(`Token generation failed: ${err}`);
  }
};

export const verifyToken: verifytokentype = (token: string, secret: string) => {
  try {
    const verifiedToken: string | JwtPayload = jwt.verify(token, secret);
    return verifiedToken;
  } catch (err) {
    throw new Error("Token verification failed");
  }
};

export const setCookies = (res: Response, refreshToken: string) => {
  res.cookie("rToken", refreshToken, {
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "prod",
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY!, 10) || 86400000, // Default to 1 day if not set
  });
};
