import { tagtype } from "./tagtypes.js";
import { posttype } from "./posttypes.js";
import { IDSTYPE } from "../../../utils/common/types.js";

export interface posttagtype extends IDSTYPE {
  post_id: posttype;
  tag_id: tagtype;
  created_at: string;
}

export interface rawposttagtype extends IDSTYPE {
  post_id: string;
  tag_id: string;
}
