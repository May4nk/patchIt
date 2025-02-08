import { usertype } from "./usertypes";
import { posttype } from "./posttypes";
import { IDSTYPE, LIKEREACTION } from "../../../utils/common/types";

export interface postlikedislikestype extends IDSTYPE {
  user_id: usertype;
  post_id: posttype;
  reaction: LIKEREACTION;
}

export interface rawpostlikedislikestype extends IDSTYPE {
  user_id: string;
  post_id: string;
  reaction: LIKEREACTION;
}
