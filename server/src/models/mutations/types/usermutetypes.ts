import { usertype } from "../../resolvers/types/usertypes.js";

interface logintype {
  username: string;
  password: string;
}

interface magiclinktype {
  email: string;
}

export interface magiclinkdatatype {
  data: magiclinktype;
}

export type rusertype = {
  id: number;
}

export interface userdatatype {
  data: usertype;
}

export interface remuserdatatype {
  data: rusertype;
}

export interface logindatatype {
  data: logintype;
}


