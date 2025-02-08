import { usertype } from "./usertypes.js";
import { posttype } from "./posttypes.js";
import { DELSTATUS } from "../../../utils/common/types.js";

export interface commenttype {
  id: string;
  likes: number;
  user_id: usertype;
  post_id: posttype;
  parent_id: commenttype;
  text: string;
  status: DELSTATUS;
  created_at: string;
}

export interface commentfiltertype {
  id: string;
  parent_id: string;
  likes: number;
  user_id: string;
  post_id: string;
  status: DELSTATUS;
}
