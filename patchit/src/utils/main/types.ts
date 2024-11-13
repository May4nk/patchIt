type TYPE = "BLOG" | "IMAGE" | "LINK" | "POLL";

export type STATUS = "ACTIVE" | "INACTIVE";

export type PRIVACY = "PUBLIC" | "PRIVATE";

export type NOTIFICATIONTYPE = "CHAT" | "FRIEND";

export type idstype = { id: number };

export type FOLLOWINGTYPE = "FOLLOW" | "FOLLOWING" | "REQUESTED";

export type RESPONSETYPE = {
  status: 200 | 500 | 404 | 0; //0: info, 200: sucess, 500: error, 404: not found
  message: string;
};

export interface ERRORTYPE extends RESPONSETYPE {
  show: boolean;
}

export interface communitynametype {
  id: number;
  communityname: string;
  profile_pic: string;
}

export interface usernametype {
  id: number;
  username: string;
  profile_pic: string;
  status: STATUS;
}

export interface popularcardtype {
  id: number;
  title: string;
  type: TYPE;
  content?: string;
  status: STATUS;
}

export interface posttype extends popularcardtype {
  likes: number;
  owner: usernametype;
  comments: idstype[];
  community_id: communitynametype;
  created_at: string;
}

export interface homeposttype {
  community_id: { posts: posttype[] };
}
