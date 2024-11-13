import { usertype } from "./usertypes.js";

export interface magictokentype {
  id: number;
  email: usertype;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface magictokenmutetype {
  id: number;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface magictokenfiltertype {    
  id: number;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
}

