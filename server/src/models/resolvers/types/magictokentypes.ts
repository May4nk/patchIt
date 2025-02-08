import { usertype } from "./usertypes.js";

export interface magictokentype {
  id: string;
  email: usertype;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface magictokenmutetype {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface magictokenfiltertype {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
}
