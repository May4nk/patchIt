import { usertype } from "./usertypes";
import { posttype } from "./posttypes";

export interface polltype {
  id: number;
  user_id: usertype;
  post_id: posttype;
  pollvalue: string;
}

export interface pollfiltertype {
  id: number;
  user_id: number;
  post_id: number;
  pollvalue: string;
}
