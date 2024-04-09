import { usertype } from "./usertypes";

export interface userpreferencetype {
  id: number;
  user_id: usertype; 
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
  blocked: string|null;
}

export interface userpreferencefiltertype {
  user_id: number; 
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
}

