import { commentcardtype } from "../../components/cards/types";
import {
  ERRORTYPE,
  FOLLOWINGTYPE,
  IDSTYPE,
  LIKEREACTION,
  posttype,
  PRIVACY,
  STATUS,
  USER_S_N_TYPE,
  userbasictype,
} from "../../utils/main/types";

export type userpagetabnames = "posts" | "comments" | "reactions" | "saved";
export type usersettingtype = {
  nsfw: boolean;
  isNew: boolean;
  isProfilePrivate: boolean;
  following: FOLLOWINGTYPE;
  allowPplToFollow: boolean;
};

export type userstatetype = {
  error: ERRORTYPE;
  settings: usersettingtype;
  activeTab: userpagetabnames;
  display_profile_pic: USER_S_N_TYPE;
  display_background_pic: USER_S_N_TYPE;
};

export type userstateactiontype =
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "UPDATE_PIC"; profile_pic: USER_S_N_TYPE }
  | { type: "UPDATE_BG_PIC"; background_pic: USER_S_N_TYPE }
  | { type: "SET_ACTIVE_TAB"; selectedTab: userpagetabnames }
  | { type: "UPDATE_SETTINGS"; settings: Partial<usersettingtype> };

export type handleuserstatetype = (
  state: userstatetype,
  action: userstateactiontype
) => userstatetype;

export type userfollowingtype = IDSTYPE & {
  follower: userbasictype;
  following: userbasictype;
};

export interface reactedposttype {
  reaction: LIKEREACTION;
  post_id: posttype;
}

export interface savedposttype {
  saved: boolean;
  pinned: boolean;
  post_id: posttype;
}

export interface userpageusertype extends IDSTYPE {
  email: string;
  username: string;
  privacy: PRIVACY;
  dob: string;
  created_at: string;
  country: string;
  background_pic: string;
  about: string;
  status: STATUS;
  new_user: boolean;
  profile_pic: string;
  role: { id: string; role: string };
  social_links: string | null;
  ownedCommunities: (IDSTYPE & {
    name: string;
    owner: IDSTYPE;
  })[];
  comments: commentcardtype[];
  posts: posttype[];
  settings: { allowppltofollow: boolean; nsfw: boolean };
  savedposts?: savedposttype[];
  reactedposts?: reactedposttype[];
  followers: userfollowingtype[];
}
