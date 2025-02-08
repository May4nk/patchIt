export interface logintype {
  email?: string;
  username?: string;
  password: string;
}

export interface requestfpasswordtype {
  message: string;
  email: string;
}

export interface magiclinktype extends requestfpasswordtype {
  password: string;
}

export type forgetpasswordtype = {
  token: string;
  password: string;
  cpassword: string;
};
