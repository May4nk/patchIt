import { usertype } from "./usertypes";
import { posttype } from "./posttypes";
import { IDSTYPE } from "../../../utils/common/types";

export interface polltype extends IDSTYPE {
  user_id: usertype;
  post_id: posttype;
  pollvalue: string;
}

export interface rawpolltype extends IDSTYPE {
  user_id: string;
  post_id: string;
  pollvalue: string;
}
