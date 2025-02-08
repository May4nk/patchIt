export type FOLLOWINGTYPE = "FOLLOW" | "FOLLOWING" | "REQUESTED";
export type ALLOWTOMSG = "ANYONE" | "NONE" | "FOLLOWERS";
export type POSTTYPE = "BLOG" | "IMAGE" | "LINK" | "POLL";
export type NOTIFYSTATUS = "ACCEPT" | "REJECT" | "PENDING";
export type CHATMEDIA = "ALL" | "IMAGES" | "VIDEOS";
export type LIKEREACTION = "TRUE" | "NONE" | "FALSE";
export type ASYNCVOIDFUNC = (e?: any) => Promise<void>;
export type NOTIFYTYPE = "CHAT" | "FRIEND";
export type DELSTATUS = "ACTIVE" | "DELETED";
export type STATUS = "ACTIVE" | "INACTIVE";
export type PRIVACY = "PUBLIC" | "PRIVATE";
export type USER_S_N_TYPE = string | null;
export type IDSTYPE = { id: string };
export type IDNTYPE = { id: number };
export type VOIDFUNC = (e?: any) => void;

export type RESPONSETYPE = {
  status: 200 | 500 | 404 | 0; //0: info, 200: sucess, 500: error, 404: not found
  message: string;
};

export interface ERRORTYPE extends RESPONSETYPE {
  show: boolean;
}

export interface communitynametype extends IDSTYPE {
  name: string;
  profile_pic: string;
}

export interface userbasictype extends IDSTYPE {
  username: string;
}

export interface usernametype extends userbasictype {
  profile_pic: string;
  status: STATUS;
}

export interface popularcardtype extends IDSTYPE {
  title: string;
  type: POSTTYPE;
  content?: string;
  status: DELSTATUS;
}

export interface posttype extends popularcardtype {
  likes: number;
  owner: usernametype;
  comments: IDSTYPE[];
  community_id: communitynametype & { owner: IDSTYPE };
  created_at: string;
}

export interface homeposttype {
  community_id: { posts: posttype[] };
}
