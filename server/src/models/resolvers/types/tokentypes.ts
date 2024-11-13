import { usertype } from "./usertypes.js";

export interface tokentype {
  id: number;
  user_id: usertype;
  token: string;
  created_at: string;
}

export interface tokenfiltertype {
  id: number;
  user_id: number;
  token: string;
  created_at: string;
}
