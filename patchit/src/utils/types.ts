import {
  FOLLOWINGTYPE,
  idstype,
  PRIVACY,
  RESPONSETYPE,
  usernametype,
} from "./main/types";
import {
  activeroomtype,
  allowedmediatype,
  chatgroupusertype,
} from "../components/chatbox/types";
import {
  communitytype,
  postlikeactiontype,
  postlikestatetype,
  postsaveopxtype,
  reactedposttype,
  savedposttype,
} from "../components/types/posttypes";

export type logintype = (userdata: userdatatype) => Promise<loggedindatatype>;

export type userdatatype = { username: string; password: string };

export interface logindatatype extends userdatatype {
  email: string;
}

export interface loggedindatatype {
  id: number;
  email: string;
  username: string;
  token: string;
  role: idstype;
  new_user: boolean;
}

export type magiclogintype = (mailTo: string) => Promise<RESPONSETYPE>;

export type loginthroughtype =
  | "googleLogin"
  | "anonymousLogin"
  | "magiclinkLogin"
  | "login"
  | "isUsernameAvailable"
  | "signupAndLoginUser";

export type usertype = { id: number; email: string; username: string };

export type checkusernametype = (
  uname?: string,
  uemail?: string
) => Promise<boolean>;

export type signupdatatype = {
  email: string;
  username: string;
  password: string;
};

//postopx ------------------------------------------------
export type likestatetype = {
  postLikes: number;
  likeState: postlikestatetype;
};

export type newpostlikedislikestate = {
  navigateTo?: string;
  newPostLikes: number;
  newLikeState: postlikestatetype;
};

export type handlepostlikestatetype = (
  userId: number | null,
  action: postlikeactiontype,
  likestate: likestatetype
) => Promise<newpostlikedislikestate>;

export type updatedbposttype = {
  status: number;
  message: string;
  navigateTo?: string;
};

export type updatepostdblikedisliketype = (
  postlikes: number,
  userReact: postlikestatetype,
  postId: number,
  userId: number
) => Promise<updatedbposttype>;

export type currentpostsavedstate = {
  savedState: boolean;
  pinnedState: boolean;
};

export type newpostsavingpinningstate = {
  navigateTo?: string;
  newSavedState: boolean;
  newPinnedState: boolean;
};

export type handlesavingposttype = (
  useraction: postsaveopxtype,
  userId: number | null,
  currentsavestate: currentpostsavedstate
) => Promise<newpostsavingpinningstate>;

export type updatepostdbsavepintype = (
  useraction: postsaveopxtype,
  userId: number | null,
  postId: number,
  savedState: boolean,
  pinnedState: boolean
) => Promise<updatedbposttype>;

export type useractionstatetype = {
  savedState: boolean;
  pinnedState: boolean;
  likedState: postlikestatetype;
  joinedState: boolean;
};

export type getuseractionstatetype = (
  communityId: number,
  postId: number,
  userSaved: savedposttype[],
  userReacted: reactedposttype[],
  userCommunities: communitytype[]
) => useractionstatetype;

//chatopx -----------------------------------------------------------
export interface chatroominfotype {
  ownerId: number;
  about: string;
  theme: string;
  room_code: string;
  roomName: string;
  isRoom: boolean;
  blocked: string[];
  profile_pic: string;
  users: usernametype[];
  allowedMedia: allowedmediatype;
  admin: string;
  co_admin: string;
  operator: string;
  acceptor: string;
}

export type ACTION = { type: "UPDATE"; payload: Partial<chatroominfotype> };

export interface createchatroomrestype extends RESPONSETYPE {
  room: activeroomtype | null;
}

export type upsertchatpreferencestype = (
  ownerId: number,
  room_code: string
) => Promise<void>;

export type createchatroomtype = (
  roomCode: string,
  ownerId: number,
  chatgroupUsers: chatgroupusertype[],
  roomName?: string
) => Promise<createchatroomrestype>;

//useropx ---------------------------------------------------------------
export type usersettinginfotype = {
  nsfw: boolean;
  isNew: boolean;
  privacy: PRIVACY;
  showProfile: boolean;
  following: FOLLOWINGTYPE;
  allowPplToFollow: boolean;
};

export type usersettinginfotypetype =
  | "UPDATE"
  | "UPDATE_SHOW_PROFILE"
  | "UPDATE_FOLLOWING";

export interface usersettinginfoactiontype {
  type: usersettinginfotypetype;
  payload: Partial<usersettinginfotype>;
}
