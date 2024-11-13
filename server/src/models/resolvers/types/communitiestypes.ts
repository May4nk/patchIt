import { userscommunitytype } from "./userscommunitytypes.js";

export interface communitytype {
  id: number;
  communityname: string;
  owner: number;
  description: string;
  status: string;
  theme: string;
  privacy: string;
  category: string;
  social_links: String;
  users: userscommunitytype[];
  background_pic: string;
  profile_pic: string;
  created_at: string;
}

export interface communityfiltertype {
  id: number;
  communityname: string;
  owner: number;
  status: string;
  privacy: string;
  theme: string;
}
