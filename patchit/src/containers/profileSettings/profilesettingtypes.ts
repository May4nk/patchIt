export interface userdatatype {
  email: string;
  username: string;
  status: string;
  about: string;
  profile_pic: string;
  background_pic: string;
}

export interface profilestatetype {
  nsfw: boolean;
  allowppltofollow: boolean;
  contentvisiblity: boolean;
}

export interface privacystatetype {
  auth_twofactor: boolean;
  searchshowprofile: boolean;
  blocked: string[] | null;
}

export interface notificationsstatetype {
  chatreq: boolean;
  mentionusername: boolean;
  activityonpost: boolean;
  activityoncmnt: boolean;
  activityonpostfollowed: boolean;
  communityfollowed: boolean;
  patcoinreceived: boolean;
  birthday: boolean;
  announcements: boolean;
}

export interface feedsstatetype {
  show_nsfw: boolean;
}

export interface chatstatetype {
  sendmsg: string;
}

export interface modalstatetype {
  txt?: string;
  btntxt?: string;
  toUpdate: string;
  placeholder?: string;
}

export interface userprofilestate {
  email: string;
  username: string;
  status: string;
  about: string;
  profile_pic: string;
  background_pic: string;
}
