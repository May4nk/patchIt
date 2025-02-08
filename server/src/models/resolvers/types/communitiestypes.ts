import { IDSTYPE, PRIVACY, STATUS } from "../../../utils/common/types.js";
import { categorytype } from "./categorytypes.js";
import { userscommunitytype } from "./userscommunitytypes.js";
import { usertype } from "./usertypes.js";

export interface communitytype extends IDSTYPE {
  name: string;
  owner: usertype;
  description: string;
  display_name: string;
  status: STATUS;
  theme: string;
  privacy: PRIVACY;
  category: categorytype;
  social_links: String;
  users: userscommunitytype[];
  background_pic: string;
  profile_pic: string;
  created_at: string;
}

export interface rawcommunitytype extends IDSTYPE {
  name: string;
  owner: string;
  display_name: string;
  description: string;
  status: STATUS;
  theme: string;
  privacy: PRIVACY;
  category: string;
  social_links: String;
  background_pic: string;
  profile_pic: string;
  created_at: string;
}

export interface communityfiltertype extends IDSTYPE {
  name: string;
  owner: string;
  status: STATUS;
  display_name: string;
  privacy: PRIVACY;
  theme: string;
  category: string;
}
