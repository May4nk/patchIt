import { IDSTYPE } from "../../../utils/common/types";
import { commenttype } from "./commenttypes";
import { usertype } from "./usertypes";

export interface usercommenttype extends IDSTYPE {
  comment_id: commenttype;
  user_id: usertype;
  created_at: string;
}

export interface usercommentfiltertype extends IDSTYPE {
  comment_id: string;
  user_id: string;
}

export type rawusercommenttype = usercommentfiltertype;
