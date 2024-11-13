import { ERRORTYPE, PRIVACY } from "../../utils/main/types";

export type handleupdatetype = (
  toUpdate: string,
  value: string
) => Promise<string>;

export type handleuserupdatetype = (
  toUpdate: string,
  val?: string
) => Promise<void>;

export type showemailpassinputtype = { email: boolean; password: boolean };
export type setpasswordtype = { old: string; new: string };

export type profilesettingtabs =
  | "account"
  | "profile"
  | "privacy"
  | "notifications"
  | "feeds"
  | "chat";

export interface userdatatype {
  email: string;
  username: string;
  privacy: PRIVACY;
  about: string;
  profile_pic: string;
  background_pic: string;
  social_links: string | null;
}

export interface profilestatetype {
  nsfw: boolean;
  allowppltofollow: boolean;
  contentvisiblity: boolean;
}

export interface privacystatetype {
  blocked: string | null;
  auth_twofactor: boolean;
  searchshowprofile: boolean;
}

export interface notificationsstatetype {
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

export interface feedsstatetype {
  show_nsfw: boolean;
}

export interface chatstatetype {
  sendmsg: string;
}

export interface privacytabpropstype {
  privacyState: privacystatetype;
  handleChange: (e: any, statename: string) => void;
}

export interface userprofilestate {
  email: string;
  about: string;
  privacy: PRIVACY;
  username: string;
  profile_pic: string;
  background_pic: string;
  social_links: string | null;
}

export interface profileprops {
  profileRef: React.Ref<HTMLInputElement>;
  wallpicRef: React.Ref<HTMLInputElement>;
  userData: userdatatype;
  profileState: profilestatetype;
  handleUserUpdate: handleuserupdatetype;
  handleChange: (e: any, statename: string) => void;
  setUserData: React.Dispatch<React.SetStateAction<userdatatype>>;
}

export interface accountprops {
  userData: userdatatype;
  handleUpdate: handleupdatetype;
  setMessage: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
  setDeactivateAcc: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<userdatatype>>;
}

export interface chatprops {
  chatState: chatstatetype;
  setChatState: React.Dispatch<React.SetStateAction<chatstatetype>>;
}
