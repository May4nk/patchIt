import {
  ALLOWTOMSG,
  ERRORTYPE,
  PRIVACY,
  STATUS,
  USER_S_N_TYPE,
} from "../../utils/main/types";

export type usersettingtypes =
  | "profile"
  | "privacy"
  | "notifications"
  | "feeds"
  | "chat";

export type profilesettingtabs = "account" | usersettingtypes;

export interface notificationstatetype {
  chatreq: boolean;
  birthday: boolean;
  announcements: boolean;
  activityonpost: boolean;
  activityoncmnt: boolean;
  mentionusername: boolean;
  patcoinreceived: boolean;
  communityfollowed: boolean;
  activityonpostfollowed: boolean;
}

export interface privacystatetype {
  blocked: USER_S_N_TYPE;
  auth_twofactor: boolean;
  searchshowprofile: boolean;
}

export interface userdatatype {
  email: string;
  about: string;
  status: STATUS;
  privacy: PRIVACY;
  username: string;
  profile_pic: USER_S_N_TYPE;
  social_links: USER_S_N_TYPE;
  background_pic: USER_S_N_TYPE;
}

export interface profilestatetype {
  nsfw: boolean;
  allowppltofollow: boolean;
  contentvisiblity: boolean;
}

export type feedsstatetype = { show_nsfw: boolean };

export type chatstatetype = { sendmsg: ALLOWTOMSG };

export type usersettingstatetype = {
  error: ERRORTYPE;
  deleteAcc: boolean;
  isUpdating: boolean;
  display_profile_pic: USER_S_N_TYPE;
  display_background_pic: USER_S_N_TYPE;
  settingActiveTab: profilesettingtabs;
  chatState: chatstatetype;
  feedsState: feedsstatetype;
  profileState: profilestatetype;
  notificationState: notificationstatetype;
  privacyState: privacystatetype;
  userData: userdatatype;
};

export type usersettingstateactiontype =
  | {
      type: "UPDATE_USERDATA";
      userData: Partial<userdatatype>;
    }
  | {
      type: "UPDATE_NOTIFICATION_SETTINGS";
      notifySettings: Partial<notificationstatetype>;
    }
  | {
      type: "UPDATE_FEED_SETTINGS";
      feedSettings: Partial<feedsstatetype>;
    }
  | {
      type: "UPDATE_PRIVACY_SETTINGS";
      privacySettings: Partial<privacystatetype>;
    }
  | {
      type: "UPDATE_CHAT_SETTINGS";
      chatSettings: Partial<chatstatetype>;
    }
  | {
      type: "UPDATE_PROFILE_SETTINGS";
      profileSettings: Partial<profilestatetype>;
    }
  | { type: "SET_ACTIVE_TAB"; selectedTab: profilesettingtabs }
  | { type: "SET_UPDATE"; update: boolean }
  | { type: "DELETE_ACCOUNT"; deleteAcc: boolean }
  | { type: "UPDATE_PIC"; profile_pic: string }
  | { type: "UPDATE_BG_PIC"; background_pic: string }
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "RESET" };

export type handleusersettingstatetype = (
  state: usersettingstatetype,
  action: usersettingstateactiontype
) => usersettingstatetype;

export type handleupdatetype = (
  toUpdate: keyof userdatatype,
  value: string
) => Promise<string>;

export type handleuserupdatetype = (
  toUpdate: keyof userdatatype,
  val: USER_S_N_TYPE
) => Promise<void>;

export type handlechangetype = (e: any, statename: usersettingtypes) => void;

export type showemailpassinputtype = { email: boolean; password: boolean };
export type setpasswordtype = { old: string; new: string };

export interface privacytabpropstype {
  privacyState: privacystatetype;
  handleChange: handlechangetype;
}

export interface profileprops {
  update: handleupdatetype;
  handleChange: handlechangetype;
  settingState: usersettingstatetype;
  handleState: React.Dispatch<usersettingstateactiontype>;
}

export interface accountprops {
  userData: userdatatype;
  handleState: React.Dispatch<usersettingstateactiontype>;
}

export interface chatprops {
  chatState: chatstatetype;
  handleState: React.Dispatch<usersettingstateactiontype>;
}

export interface notificationprops {
  handleChange: handlechangetype;
  notificationsState: notificationstatetype;
}

export interface feedprops {
  feedsState: feedsstatetype;
  handleChange: handlechangetype;
}
