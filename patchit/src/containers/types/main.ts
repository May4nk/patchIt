import { communityusertype } from "../../components/infosection/types";
import { posttype, PRIVACY, STATUS } from "../../utils/main/types";

export interface usertype {
  id?: number;
  email: string;
  username: string;
  dob: number;
  status: string;
  country?: string;
}

type ownertype = {
  id: number;
  username: string;
};

export interface communitydatatype {
  id: number;
  description: string;
  about: string;
  status: STATUS; 
  communityname: string;
  background_pic: string;
  created_at: string;
  privacy: PRIVACY;
  profile_pic: string;
  theme: string;
  owner: ownertype;
  posts: posttype[];
  users: communityusertype[];
  social_links: string | null;
  settings: { nsfw: boolean; allowppltofollow: boolean };
}
