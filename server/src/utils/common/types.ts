import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { usertype } from "../../models/resolvers/types/usertypes";

export type STATUS = "ACTIVE" | "INACTIVE";
export type PRIVACY = "PUBLIC" | "PRIVATE";
export type DELSTATUS = "ACTIVE" | "DELETED";
export type NOTIFYSTATUS = "ACCEPT" | "REJECT" | "PENDING";
export type NOTIFYTYPE = "CHAT" | "FRIEND";
export type CHATMEDIA = "ALL" | "IMAGES" | "VIDEOS";
export type LIKEREACTION = "TRUE" | "NONE" | "FALSE";
export type ALLOWTOMSG = "ANYONE" | "NONE" | "FOLLOWERS";
export type POSTTYPE = "BLOG" | "IMAGE" | "POLL" | "LINK";
export type IDSTYPE = { id: string };
export type IDNTYPE = { id: number };

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

export type tokenusertype = {
  id: string;
  email: string;
  username: string;
  role: number;
  iat: number;
  exp: number;
};

export type loggedusertype = Omit<tokenusertype, "iat" | "exp">;

export type verifytokentype = (
  token: string,
  secret: string
) => string | JwtPayload;

export type setcookiestype = (res: Response, refreshToken: string) => void;
