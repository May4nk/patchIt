import { ERRORTYPE, VOIDFUNC } from "../../utils/main/types";

export interface loginboxpropstype {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

//0: login, 1: signup, 3: forget password, 4: forget mail sent, 6: magic link, 7: magic link mail sent
export type activeloginleveltype = 0 | 1 | 3 | 4 | 6 | 7;

export interface signuppropstype {
  error: ERRORTYPE;
  closeLogin: VOIDFUNC;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

export interface loginpropstype {
  closeLogin: VOIDFUNC;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
  setActiveLoginLevel: React.Dispatch<
    React.SetStateAction<activeloginleveltype>
  >;
}

export interface otherloginpropstype {
  closeLogin: VOIDFUNC;
  activeLoginLevel: activeloginleveltype;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
  setActiveLoginLevel: React.Dispatch<
    React.SetStateAction<activeloginleveltype>
  >;
}

export interface forgotpasswordpropstype {
  activeLoginLevel: activeloginleveltype;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
  setActiveLoginLevel: React.Dispatch<
    React.SetStateAction<activeloginleveltype>
  >;
}

export interface magicloginpropstype {
  activeLoginLevel: activeloginleveltype;
  setActiveLoginLevel: React.Dispatch<
    React.SetStateAction<activeloginleveltype>
  >;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}
