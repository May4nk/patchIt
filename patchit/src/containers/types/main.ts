import { communityusertype } from "../../components/infosection/types";
import {
  IDSTYPE,
  posttype,
  PRIVACY,
  STATUS,
  USER_S_N_TYPE,
  userbasictype,
} from "../../utils/main/types";

export interface usertype {
  id?: string;
  email: string;
  username: string;
  dob: number;
  status: string;
  country?: string;
}

export interface communitydatatype extends IDSTYPE {
  description: string;
  about: string;
  status: STATUS;
  name: string;
  display_name: USER_S_N_TYPE;
  background_pic: string;
  created_at: string;
  privacy: PRIVACY;
  profile_pic: string;
  theme: string;
  owner: userbasictype;
  posts: posttype[];
  users: communityusertype[];
  social_links: string | null;
  settings: { nsfw: boolean; allowppltofollow: boolean };
}
