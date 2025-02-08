import { ERRORTYPE, IDSTYPE } from "../../utils/main/types";

//0: login, 1: signup, 3: forgot password request, 4: forget mail sent, 5: reset password, 7: magiclink login, 8: magic mail sent, 9: verify magic mail
export type loginpagelevels = 0 | 1 | 3 | 4 | 5 | 7 | 8 | 9;
export type leveltype = 0 | 1;

export interface logindatatype {
  email?: string;
  username?: string;
  password: string;
}

export interface fpasswordtype {
  password: string;
  cpassword: string;
}

export interface usertype extends IDSTYPE {
  email: string;
  username: string;
}

export interface signupdatatype extends fpasswordtype, Omit<usertype, "id"> {
  consent: boolean;
}

export interface tokenusertype extends usertype {
  new_user: boolean;
  role: { role_id: number };
}

export interface magictokenusertype extends tokenusertype {
  token: string;
}

//otherlogins
export interface otherloginpropstype {
  handleLoginGreetings: (level: loginpagelevels) => void;
}

//forgot password
export interface fpasswordpropstype {
  token: string | undefined;
  loginLevel: loginpagelevels;
  handleLoginGreetings: (level: loginpagelevels) => void;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

// greeting page
export interface greetingpropstype {
  move: boolean;
  loginLevel: loginpagelevels;
  handleLoginGreetings: (level: loginpagelevels) => void;
  setLoginLevel: React.Dispatch<React.SetStateAction<loginpagelevels>>;
}

//loginpage
export interface loginpropstype {
  handleLoginGreetings: (level: loginpagelevels) => void;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

//signup
export interface signuppropstype {
  handleLoginGreetings: (level: loginpagelevels) => void;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

//magiclogin page
export interface magicloginpropstype {
  error: ERRORTYPE;
  loginLevel: loginpagelevels;
  handleLoginGreetings: (level: loginpagelevels) => void;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}
