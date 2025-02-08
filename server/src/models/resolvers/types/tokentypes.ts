import { DELSTATUS } from "../../../utils/common/types.js";
import { usertype } from "./usertypes.js";

export interface tokentype {
  id: string;
  user_id: usertype;
  token: string;
  status: DELSTATUS;
  created_at: string;
}

export interface tokenfiltertype {
  id: string;
  user_id: string;
  token: string;
  created_at: string;
}
