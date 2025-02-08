import {
  communitynametype,
  IDSTYPE,
  usernametype,
} from "../../utils/main/types";

export interface communitytype extends communitynametype {
  privacy: string;
  about: string;
  status: string;
  theme: string;
  users: IDSTYPE[];
  posts: IDSTYPE[];
}

export interface usertype extends usernametype {
  email: string;
  about: string;
  posts: IDSTYPE[];
}

export interface searchcardpropstype {
  usertype: boolean;
  user?: usertype;
  community?: communitytype;
}
