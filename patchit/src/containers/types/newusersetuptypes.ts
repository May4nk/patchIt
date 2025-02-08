import {
  communitynametype,
  ERRORTYPE,
  IDSTYPE,
  STATUS,
  USER_S_N_TYPE,
} from "../../utils/main/types";

export type newusersetuplevel = 0 | 1 | 2 | 3;

export interface communitytype extends IDSTYPE, communitynametype {
  description: string;
  privacy: string;
  status: STATUS;
}

export interface selectedcommunitytype {
  user_id: string;
  community_id: string;
}

export interface newusersetuptype {
  about: string;
  new_user: boolean;
  profile_pic: USER_S_N_TYPE;
  background_pic: USER_S_N_TYPE;
}

export type newuserstatetype = {
  error: ERRORTYPE;
  level: newusersetuplevel;
  userInfo: newusersetuptype;
  display_profile_pic: USER_S_N_TYPE;
  display_background_pic: USER_S_N_TYPE;
  userCommunities: selectedcommunitytype[];
};

export type newuserstateactiontype =
  | {
      type: "UPDATE_USERINFO";
      info: Partial<newuserstatetype["userInfo"]>;
    }
  | { type: "UPDATE_BG_PIC"; background_pic: USER_S_N_TYPE }
  | { type: "UPDATE_PIC"; profile_pic: USER_S_N_TYPE }
  | { type: "SET_LEVEL"; level: newusersetuplevel }
  | { type: "ADD_USERCOMMUNITY"; community: selectedcommunitytype }
  | { type: "DEL_USERCOMMUNITY"; communityId: string }
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "RESET" };

export type handlenewuserstatetype = (
  state: newuserstatetype,
  action: newuserstateactiontype
) => newuserstatetype;

export type handledelpictype = (
  toUpdate: "profile_pic" | "background_pic"
) => void;
