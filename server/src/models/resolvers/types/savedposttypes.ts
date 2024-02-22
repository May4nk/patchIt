import { usertype } from "./usertypes";
import { posttype } from "./posttypes";

export interface savedposttype {
  id: number;
  user_id: usertype;
  post_id: posttype;
  saved: boolean;
  pinned: boolean;
}

export interface savedpostfiltertype {
  id: number;
  user_id: number;
  post_id: number;
  saved: boolean;
  pinned: boolean;
}  
