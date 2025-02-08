import { usertype } from "./usertypes";
import { posttype } from "./posttypes";
import { IDSTYPE } from "../../../utils/common/types";

export interface savedposttype extends IDSTYPE {
  user_id: usertype;
  post_id: posttype;
  saved: boolean;
  pinned: boolean;
}

export interface rawsavedposttype extends IDSTYPE {
  user_id: string;
  post_id: string;
  saved: boolean;
  pinned: boolean;
}
