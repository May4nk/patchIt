import { usertype } from "./usertypes";
import { posttype } from "./posttypes";

export interface postlikedislikestype {
  id: number;
  user_id: usertype;
  post_id: posttype;
  reaction: number;
}

export interface postlikedislikesfiltertype {
  id: number;
  user_id: number;
  post_id: number;
  reaction: number;
}
