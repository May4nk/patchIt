export interface loginboxpropstype {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface userlogintype {
  username: string;
  password: string;
}

export type activelogintype = "login" | "magiclogin" | "signup";

export interface loginuserdatatype {
  email: string;
  password: string;
  username: string;
  consent: boolean;
  confirm_password: string;
}

export interface loginforgetdatatype {
  forgotemail: string;
  forgotpassword: string;
  forgotusername: string;
}

export interface signuppropstype {
  error: string;
  userData: loginuserdatatype;
  closeLogin: () => void;
  handleChange: (e: any) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setUserData: React.Dispatch<React.SetStateAction<loginuserdatatype>>;
}

export interface loginpropstype {
  closeLogin: () => void;
  userData: loginuserdatatype;
  handleChange: (e: any) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setForgetLevel: React.Dispatch<React.SetStateAction<number>>;
}

export interface otherloginpropstype {
  activeLogin: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setActiveLogin: React.Dispatch<React.SetStateAction<activelogintype>>;
}

export interface magicloginpropstype {
  userData: loginuserdatatype;
  handleChange: (e: any) => void;
  magicLoginLevel: number;
  setMagicLoginLevel: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setUserData: React.Dispatch<React.SetStateAction<loginuserdatatype>>;
}
