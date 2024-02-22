import { tagtype } from "./tagtypes.js";
import { posttype } from "./posttypes.js";

export interface posttagstype {  
  id: number;
  post_id: posttype;
  tag_id: tagtype;
  created_at: string;
}

export interface posttagsfiltertype {
  id: number;
  post_id: number;
  tag_id: number;
}
