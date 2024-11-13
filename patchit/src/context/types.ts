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
  sendmsg?: string;
  searchshowprofile?: boolean;
  auth_twofactor?: boolean;
  blocked?: string | null;
};

export type usertype = {
  new_user?: boolean;
  profile_pic?: string;
  settings: userpreferencetype;
};

export interface userstate extends userpreferencetype {
  new_user?: boolean;
  profile_pic?: string;
}

export interface loggedusercontexttype {
  loggedUser: userstate | null;
  updateLoggedUser: (userstate: userstate) => void;
}

export interface usercontextdatatype {
  data: { listUsers: usertype[] };
}

// authcontext type -----------------------------------
export interface initialstatetype {
  user: null | user | loginusertype;
}

export interface user {
  id: number;
  username: string;
  email: string;
  role: number;
  iat: number;
  exp: number;
}

export interface loginusertype {
  id: number;
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
