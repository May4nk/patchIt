import { commenttype } from "./commenttypes";
import { usertype } from "./usertypes";

export interface usercommenttype {
  id: number;
  comment_id: commenttype;
  user_id: usertype;
  created_at: string;
}

export interface usercommentfiltertype {
  id: number;
  comment_id: number;
  user_id: number;
}
