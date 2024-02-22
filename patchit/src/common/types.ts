//loginvia --------------------------------
export interface loginUsertype {
  id: number
  username: string;
  email: string;
  token: string;
  new_user: boolean;
  role: { id: number };
}

export interface loggedintype{
  loginUser : loginUsertype;
}

export interface loggedindatatype {
  data: loggedintype
}

export type loginthroughtype = "googleLogin" | "anonymousLogin" | "magiclinkLogin" | "login";

export type usrdatatype = { username: string, password: string };

export interface logindatatype extends usrdatatype {
  email: string
}

export type usertype = { id: number, email: string, username: string };