import { ERRORTYPE, STATUS, USER_S_N_TYPE } from "../../utils/main/types";
import { communitydatatype } from "./main";

export type communitystatetype = {
  status: STATUS;
  inCommunity: boolean;
  pic: string[];
  error: ERRORTYPE;
  display_profile_pic: USER_S_N_TYPE;
  display_background_pic: USER_S_N_TYPE;
  settings: communitydatatype["settings"];
};

export type communitystateactiontype =
  | {
      type: "UPDATE_COMMUNITY_SETTINGS";
      settings: Partial<communitydatatype["settings"]>;
    }
  | { type: "UPDATE_BG_PIC"; background_pic: string }
  | { type: "UPDATE_PIC"; profile_pic: string }
  | { type: "SET_PIC"; pic: string[] }
  | { type: "UPDATE_IN_COMMUNITY"; inCommunity: boolean }
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "RESET" };

export type handlecommunitystatetype = (
  state: communitystatetype,
  action: communitystateactiontype
) => communitystatetype;
