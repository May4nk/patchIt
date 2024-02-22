import { usertype } from "./usertypes.js";
import { communitytype } from "./communitiestypes.js";
import { tagtype } from "./tagtypes.js";
import { posttagstype } from "./posttagstypes.js";

enum STATUS {
  "ACTIVE",
  "INACTIVE"
}

enum PRIVACY {
  "PUBLIC",
  "PRIVATE"
}

enum TYPE {
  "BLOG",
  "POLL",
  "IMAGE",
  "LINK"
}

export interface posttype {
  id: number;
  title: string;
  owner: usertype;
  community_id: communitytype;
  content: string;
  tags: [posttagstype];
  type: TYPE;
  status: STATUS;
  privacy: PRIVACY;
  likes: number;
  created_at: string;
}

export interface postfiltertype {
  id: number;
  owner: number;
  community_id: number;
  tag: string;
  type: TYPE;
  status: STATUS;
  privacy: PRIVACY;
  likes: number;
}

