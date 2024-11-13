import { usertype } from "./usertypes.js";
import { posttype } from "./posttypes.js";

export interface commenttype {
  id: number;
  likes: number;
  user_id: usertype;
  post_id: posttype;
  parent_id: commenttype;
  comment: string;
  status: string;
  created_at: string;
}

export interface commentfiltertype {
  id: number;
  parent_id: number;
  likes: number;
  user_id: number;
  post_id: number;
  status: string;
}
