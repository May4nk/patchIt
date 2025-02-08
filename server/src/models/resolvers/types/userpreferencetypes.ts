import { ALLOWTOMSG, IDSTYPE } from "../../../utils/common/types";
import { usertype } from "./usertypes";

type usersettingtype = {
  nsfw: boolean;
  visiblity: boolean;
  show_nsfw: boolean;
  allowppltofollow: boolean;
  contentvisiblity: boolean;
  chatreq: ALLOWTOMSG;
  mentionusername: boolean;
  activityonpost: boolean;
  activityoncmnt: boolean;
  activityonpostfollowed: boolean;
  patcoinreceived: boolean;
  communityfollowed: boolean;
  birthday: boolean;
  announcements: boolean;
  searchshowprofile: boolean;
  auth_twofactor: boolean;
};

export interface userpreferencetype extends usersettingtype, IDSTYPE {
  user: usertype;
}

export interface userpreferencefiltertype extends usersettingtype {
  user: string;
}

export type rawuserpreferencetype = userpreferencefiltertype & IDSTYPE;

export type ruserpreferencetype = IDSTYPE & {
  user: string;
};
