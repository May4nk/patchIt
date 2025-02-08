import {
  IDSTYPE,
  LIKEREACTION,
  RESPONSETYPE,
  USER_S_N_TYPE,
} from "./main/types";
import { chatgroupusertype } from "../components/chatbox/types";
import {
  communitytype,
  postlikeactiontype,
  postsaveopxtype,
  reactedposttype,
  savedposttype,
} from "../components/types/posttypes";

export type userdatatype = {
  email?: string;
  username?: string;
  password: string;
};

export type usertype = IDSTYPE & { email: string; username: string };

export interface loggedinuserdatatype extends usertype {
  token: string;
  role: { role_id: number };
  new_user: boolean;
}

export type logintype = (
  userdata: userdatatype
) => Promise<loggedinuserdatatype>;

export type magiclogintype = (mailTo: string) => Promise<RESPONSETYPE>;

export type loginthroughtype =
  | "googleLogin"
  | "anonymousLogin"
  | "magiclinkLogin"
  | "login"
  | "isUsernameAvailable"
  | "signupAndLoginUser";

export type checkusernametype = (
  uname?: string,
  uemail?: string
) => Promise<boolean>;

export type signupdatatype = {
  email: string;
  username: string;
  password: string;
};

//useSignedUrl
export type reqtype = "GET" | "PUT";
export type signedfiletype = {
  name: string;
  type?: string;
};

export type signedurltype = {
  signedUrl: string;
  fileUrl: string;
  req: reqtype;
};

export type getsignedurlfiletype = {
  postId: string;
  userId: string;
  req: reqtype;
  files: signedfiletype[];
};

export type getsignedurltype = (
  file: getsignedurlfiletype
) => Promise<signedurltype[]>;

export type signedurlrestype = {
  getSignedUrl: signedurltype[];
};

//postopx ------------------------------------------------
export type likestatetype = {
  postLikes: number;
  liked: LIKEREACTION;
};

export type newpostlikedislikestate = {
  navigateTo?: string;
  newPostLikes: number;
  newLikeState: LIKEREACTION;
};

export type handlepostlikestatetype = (
  userId: string,
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
  userReact: LIKEREACTION,
  postId: string,
  userId: string
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

export type handlesavingpostdatatype = {
  useraction: postsaveopxtype;
  userId: string;
  currentsavestate: currentpostsavedstate;
};

export type handlesavingposttype = (
  data: handlesavingpostdatatype
) => Promise<newpostsavingpinningstate>;

export type updatepostdbsavepindatatype = {
  useraction: postsaveopxtype;
  userId: string;
  postId: string;
  savedState: boolean;
  pinnedState: boolean;
};

export type updatepostdbsavepintype = (
  data: updatepostdbsavepindatatype
) => Promise<updatedbposttype>;

export type userreactiontype = {
  savedState: boolean;
  pinnedState: boolean;
  likedState: LIKEREACTION;
  joinedState: boolean;
};

export type getuseractionstatedatatype = {
  communityId: string;
  postId: string;
  userSaved: savedposttype[];
  userReacted: reactedposttype[];
  userCommunities: communitytype[];
};

export type getuseractionstatetype = (
  data: getuseractionstatedatatype
) => userreactiontype;

//chatopx -----------------------------------------------------------
export interface createchatroomrestype extends RESPONSETYPE {
  roomId: USER_S_N_TYPE;
}

export type upsertchatpreferencestype = (
  ownerId: string,
  roomId: string
) => Promise<void>;

export type createchatroomroomtype = {
  ownerId: string;
  roomName: string;
  chatgroupUsers: chatgroupusertype[];
};

export type createchatroomtype = (
  room: createchatroomroomtype
) => Promise<createchatroomrestype>;

// s3 upload ----------------------------------
export type filetype = {
  url: string;
  file: File;
  progress: (prog) => void;
};
