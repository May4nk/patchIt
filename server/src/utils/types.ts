import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { usertype } from "../models/resolvers/types/usertypes";

export interface sorttype {
  column?: string;
  nulls?: string;
  order?: "asec" | "desc";
}

export interface filtersorttype<K> {
  filter?: K;
  sort?: sorttype[];
  limit?: number;
}

export type generatetokentype = (user: usertype) => Promise<{
  accessToken: string;
  refreshToken: string;
}>;

export type verifytokentype = (
  token: string,
  secret: string
) => string | JwtPayload;

export type setcookiestype = (res: Response, refreshToken: string) => void;
