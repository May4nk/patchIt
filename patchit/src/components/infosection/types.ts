import { userfollowingtype } from "../../containers/types/user";
import { sociallinktype } from "../settings/types";
import {
  communitynametype,
  ERRORTYPE,
  idstype,
  posttype,
  PRIVACY,
  STATUS,
  usernametype,
} from "../../utils/main/types";
import {
  usersettinginfoactiontype,
  usersettinginfotype,
} from "../../utils/types";

interface userposttype extends posttype {
  community_id: communitynametype;
}

export interface communitypatcherdatatype {
  id: number;
  communityname: string;
  owner: idstype;
}

export type communityusertype = { id: number; user_id: idstype };

export interface infoaboutuserdatatype {
  id: number;
  about: string;
  created_at: string;
  username: string;
  privacy: PRIVACY;
  background_pic: string;
  profile_pic: string;
  status: STATUS;
  posts: userposttype[];
  followers: userfollowingtype[];
  userSettings: usersettinginfotype;
  updateUserSettings: React.Dispatch<usersettinginfoactiontype>;
}

export interface infoaboutcommunitydatatype {
  id: number;
  communityname: string;
  about: string;
  theme: string;
  background_pic: string;
  description: string;
  owner: { id: number; username: string };
  privacy: PRIVACY;
  profile_pic: string;
  created_at: string;
  posts: idstype[];
  users: idstype[];
  inCommunity: boolean;
  setInCommunity: React.Dispatch<React.SetStateAction<boolean>>;
}

interface infoaboutuserprops {
  data: infoaboutuserdatatype;
  userdata: true;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

interface infoaboutcommunityprops {
  data: infoaboutcommunitydatatype;
  userdata: false;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

export type infoaboutpropstype = infoaboutcommunityprops | infoaboutuserprops;

export interface infosectionprops {
  communitypatcherdata?: communitypatcherdatatype[];
}

export interface infouserscommunityprops {
  communitypatcherdata: communitypatcherdatatype[];
}

// infotab type ----------------------------------------
export interface communitytype {
  id: number;
  communityname: string;
  posts: idstype[];
  users: idstype[];
  profile_pic: string;
}

export interface infotabprops {
  community: communitytype;
}

// inforecommended type ------------------------------------------
export interface recommendedposttype {
  id: number;
  likes: number;
  title: string;
  type: string;
  owner: usernametype & { status: STATUS };
  comments: idstype[];
  community_id: communitynametype;
}

// infocreatecard type ----------------------------------
export interface infocreatecardtype {
  id: number;
  about: string;
  communityname: string;
  background_pic: string;
  profile_pic: string;
  created_at: string;
  posts: idstype[];
  users: idstype[];
}

export interface infocreatecardprops {
  data: infocreatecardtype & { inCommunity: boolean };
}

// infosocial type --------------------------------------------
export interface infosocialpropstype {
  socialData: sociallinktype | null;
}
