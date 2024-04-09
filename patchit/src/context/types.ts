// usercontext type -------------------------------
export type usertype = {
  new_user?: boolean;
  settings: {
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
    blocked?: string|null;
  };
};

export interface userstate {
  new_user?: boolean;
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
  blocked?: string|null;
}

export interface loggedusercontexttype {
  loggedUser: userstate | null;
  updateLoggedUser: (userstate: userstate) => void;
}

export interface usercontextdatatype {
  data: { listUsers: usertype[] };
}

// authcontext type -----------------------------------

interface user {
  id: number;
  username: string;
  email: string;
  user_id: number;
  role_id: number;
  role: { id: number };
  iat: number;
  exp: number;
}

export interface userdatatype {
  id: number;
  role: { id: number };
  new_user: boolean;
  username: string;
  email: string;
  token: string;
}

export interface authcontexttype {
  user: user | null;
  login: (userData: userdatatype) => void;
  logout: () => void;
}

export interface tokentype {
  email: string;
  password: string;
  role: number;
  exp: number;
}

export interface initialstatetype {
  user: tokentype | null;
}
