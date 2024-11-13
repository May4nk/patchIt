import { idstype } from "../../utils/main/types";

export interface communitytype {
  id: number;
  communityname: string;
  profile_pic: string;
  privacy: string;
  about: string;
  status: string;
  theme: string;
  users: idstype[];
  posts: idstype[];
}

export interface usertype {
  id: string;
  email: string;
  username: string;
  profile_pic: string;
  about: string;
  status: string;
  posts: idstype[];
}

export interface searchcardpropstype {
  usertype: boolean;
  user?: usertype;
  community?: communitytype;
}
