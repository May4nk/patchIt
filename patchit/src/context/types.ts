import { ALLOWTOMSG, IDSTYPE, USER_S_N_TYPE } from "../utils/main/types";

// loggedusercontext type -------------------------------
type userpreferencetype = {
  nsfw?: boolean;
  visiblity?: boolean;
  show_nsfw?: boolean;
  allowppltofollow?: boolean;
  contentvisiblity?: boolean;
  chatreq?: boolean;
  mentionusername?: boolean;
  activityonpost?: boolean;
  activityoncmnt?: boolean;
  activityonpostfollowed?: boolean;
  patcoinreceived?: boolean;
  communityfollowed?: boolean;
  birthday?: boolean;
  announcements?: boolean;
  sendmsg?: ALLOWTOMSG;
  searchshowprofile?: boolean;
  auth_twofactor?: boolean;
  blocked?: USER_S_N_TYPE;
};

export type usertype = {
  profile_pic: USER_S_N_TYPE;
  settings: userpreferencetype;
};

export interface userstate extends userpreferencetype {
  profile_pic?: USER_S_N_TYPE;
}

export interface loggedusercontexttype {
  loggedUser: userstate | null;
  updateLoggedUser: (userstate: userstate) => void;
}

// authcontext type -----------------------------------
export interface initialstatetype {
  user: null | user | loginusertype;
}

export interface user extends IDSTYPE {
  username: string;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

export interface loginusertype extends IDSTYPE {
  email: string;
  username: string;
  role: number;
  token: string;
  new_user: boolean;
}

export interface authcontexttype {
  logout: () => void;
  user: initialstatetype["user"];
  login: (userData: loginusertype) => void;
}

export type actiontype =
  | { type: "LOGIN"; payload: loginusertype }
  | { type: "LOGOUT" };
