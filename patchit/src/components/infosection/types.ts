import { sociallinktype } from "../settings/types";
import {
  userstateactiontype,
  userfollowingtype,
  usersettingtype,
} from "../../containers/types/user";
import {
  communitynametype,
  IDSTYPE,
  NOTIFYTYPE,
  posttype,
  PRIVACY,
  STATUS,
  USER_S_N_TYPE,
  userbasictype,
  usernametype,
} from "../../utils/main/types";

export type communityusertype = IDSTYPE & { user_id: IDSTYPE };
export type sendnotificationreqtype = (type: NOTIFYTYPE) => Promise<void>;

export interface infoaboutuserdatatype extends IDSTYPE {
  about: string;
  created_at: string;
  username: string;
  privacy: PRIVACY;
  background_pic: USER_S_N_TYPE;
  profile_pic: USER_S_N_TYPE;
  status: STATUS;
  posts: posttype[];
  followers: userfollowingtype[];
  userSettings: usersettingtype;
  updateUserSettings: React.Dispatch<userstateactiontype>;
}

export interface infoaboutcommunitydatatype extends IDSTYPE {
  name: string;
  about: string;
  theme: string;
  background_pic: USER_S_N_TYPE;
  description: string;
  owner: userbasictype;
  privacy: PRIVACY;
  profile_pic: string;
  created_at: string;
  posts: IDSTYPE[];
  users: IDSTYPE[];
  inCommunity: boolean;
  updateCommunitySettings: React.Dispatch<any>;
}

interface infoaboutuserprops {
  userdata: true;
  data: infoaboutuserdatatype;
}

interface infoaboutcommunityprops {
  data: infoaboutcommunitydatatype;
  userdata: false;
}

export type infoaboutpropstype = infoaboutcommunityprops | infoaboutuserprops;

export interface communitypatcherdatatype extends IDSTYPE {
  name: string;
  owner: IDSTYPE;
}

export interface infosectionprops {
  communitypatcherdata?: communitypatcherdatatype[];
}

export interface infouserscommunityprops {
  communitypatcherdata: communitypatcherdatatype[];
}

// infotab type ----------------------------------------
export interface communitytype extends IDSTYPE {
  name: string;
  posts: IDSTYPE[];
  users: IDSTYPE[];
  owner: IDSTYPE;
  profile_pic: USER_S_N_TYPE;
}

export interface infotabprops {
  community: communitytype;
}

// inforecommended type ------------------------------------------
export interface recommendedposttype extends IDSTYPE {
  likes: number;
  title: string;
  type: string;
  owner: usernametype;
  comments: IDSTYPE[];
  community_id: communitynametype & { owner: IDSTYPE };
}

// infocreatecard type ----------------------------------
export interface infocreatecardtype extends IDSTYPE {
  about: string;
  name: string;
  background_pic: USER_S_N_TYPE;
  profile_pic: USER_S_N_TYPE;
  created_at: string;
  owner: IDSTYPE;
  posts: IDSTYPE[];
  users: IDSTYPE[];
}

export interface infocreatecardprops {
  data: infocreatecardtype & { inCommunity: boolean };
}

// infosocial type --------------------------------------------
export interface infosocialpropstype {
  socialData: sociallinktype | null;
}
