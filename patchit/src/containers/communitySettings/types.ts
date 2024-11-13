import { ERRORTYPE, PRIVACY } from "../../utils/main/types";

export type statenametype = "profile" | "notifications" | "privacy";

export type handlechangetype = (e: any, statename: statenametype) => void;

export interface communitystatetype {
  profile_pic: string;
  background_pic: string;
  about: string;
  description: string;
  privacy: PRIVACY;
  theme: string;
  social_links: string | null;
}

export interface privacystatetype {
  nsfw: boolean;
  handlers: number[];
}

export type showinputtype = { about: boolean };

interface communitysettingcommunitytype extends communitystatetype {
  id: number;
  owner: { id: number; username: string };
}

export interface communitypreferencetype extends notificationsstatetype {
  id: number;
  community_name: communitysettingcommunitytype;
  nsfw: boolean;
  handlers: string;
}

export interface notificationsstatetype {
  newuserreq: boolean;
  reportonpost: boolean;
  reportoncmnt: boolean;
  reportonuser: boolean;
  activityincommunity: boolean;
  birthday: boolean;
}

export interface notificationtabpropstype {
  handleChange: handlechangetype;
  notificationsState: notificationsstatetype;
}

export interface privacytabpropstype {
  privacyState: privacystatetype;
  handleChange: handlechangetype;
  setPrivacyState: React.Dispatch<React.SetStateAction<privacystatetype>>;
}

export interface profiletabpropstype {
  cname: string;
  communityState: communitystatetype;
  setErrorMessage: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
  setDeleteCommunity: React.Dispatch<React.SetStateAction<boolean>>;
  setCommunityState: React.Dispatch<React.SetStateAction<communitystatetype>>;
}
