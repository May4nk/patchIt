import { usertype } from "./usertypes.js";
import { posttagtype } from "./posttagstypes.js";
import { communitytype } from "./communitiestypes.js";
import { DELSTATUS, IDSTYPE, POSTTYPE } from "../../../utils/common/types.js";

export interface posttype extends IDSTYPE {
  title: string;
  owner: usertype;
  community_id: communitytype;
  content: string;
  tags: [posttagtype];
  type: POSTTYPE;
  status: DELSTATUS;
  likes: number;
  created_at: string;
}

export interface postfiltertype extends IDSTYPE {
  owner: string;
  community_id: string;
  tag: string;
  type: POSTTYPE;
  status: DELSTATUS;
  likes: number;
}
