import {
  ERRORTYPE,
  IDSTYPE,
  PRIVACY,
  USER_S_N_TYPE,
  userbasictype,
} from "../../utils/main/types";

export type communitysettingtabs = "profile" | "notifications" | "privacy";

export type handlechangetype = (
  e: any,
  statename: communitysettingtabs
) => void;

type communitysettingtype = {
  theme: string;
  about: string;
  privacy: PRIVACY;
  description: string;
  profile_pic: USER_S_N_TYPE;
  social_links: USER_S_N_TYPE;
  background_pic: USER_S_N_TYPE;
};

export interface communitysetstatetype extends communitysettingtype {
  owner: string;
}

export interface privacystatetype {
  nsfw: boolean;
  handlers: number[];
}

export interface notificationstatetype {
  newuserreq: boolean;
  reportonpost: boolean;
  reportoncmnt: boolean;
  reportonuser: boolean;
  activityincommunity: boolean;
  birthday: boolean;
}

export interface communitysettingstatetype {
  error: ERRORTYPE;
  isUpdating: boolean;
  deleteCommunity: boolean;
  privacyState: privacystatetype;
  communityData: communitysetstatetype;
  display_profile_pic: USER_S_N_TYPE;
  display_background_pic: USER_S_N_TYPE;
  settingActiveTab: communitysettingtabs;
  notificationState: notificationstatetype;
}

export type communitysettingstateactiontype =
  | {
      type: "UPDATE_COMMUNITYDATA";
      communityData: Partial<communitysetstatetype>;
    }
  | {
      type: "UPDATE_NOTIFICATION_SETTINGS";
      notifySettings: Partial<notificationstatetype>;
    }
  | {
      type: "UPDATE_PRIVACY_SETTINGS";
      privacySettings: Partial<privacystatetype>;
    }
  | {
      type: "UPDATE_PIC";
      profile_pic: USER_S_N_TYPE;
    }
  | {
      type: "UPDATE_BG_PIC";
      background_pic: USER_S_N_TYPE;
    }
  | { type: "SET_ACTIVE_TAB"; selectedTab: communitysettingtabs }
  | { type: "SET_UPDATE"; update: boolean }
  | { type: "DELETE_ACCOUNT"; deleteAcc: boolean }
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "RESET" };

export type handlecommunitysettingstatetype = (
  state: communitysettingstatetype,
  action: communitysettingstateactiontype
) => communitysettingstatetype;

interface communitysettingcommunitytype extends communitysettingtype, IDSTYPE {
  owner: userbasictype;
}

export interface communitypreferencetype
  extends IDSTYPE,
    notificationstatetype {
  community_name: communitysettingcommunitytype;
  nsfw: boolean;
  handlers: string;
}

//notification tab -------------------------------------
export interface notificationtabpropstype {
  handleChange: handlechangetype;
  notificationsState: notificationstatetype;
}

//privacy tab ---------------------------------
export interface privacytabpropstype {
  privacyState: privacystatetype;
  handleChange: handlechangetype;
}

//profile tab --------------------------------------------
export interface profiletabpropstype {
  cname: string;
  communityState: {
    data: communitysetstatetype;
    show_profile_pic: USER_S_N_TYPE;
    show_background_pic: USER_S_N_TYPE;
  };
  handleState: React.Dispatch<communitysettingstateactiontype>;
}

export type handlecommunityupdatetype = (
  update: string,
  val: string
) => Promise<void>;
