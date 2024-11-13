import { usertype } from "./usertypes";

type usersettingtype = {
  nsfw: boolean;
  visiblity: boolean;
  show_nsfw: boolean;
  allowppltofollow: boolean;
  contentvisiblity: boolean;
  chatreq: boolean;
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

export interface userpreferencetype extends usersettingtype {
  id: number;
  user_id: usertype;
}

export interface userpreferencefiltertype extends usersettingtype {
  user_id: number;
}
