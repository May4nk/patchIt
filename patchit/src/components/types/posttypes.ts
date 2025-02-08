import { imagetype } from "../../containers/newpost/types";
import {
  ERRORTYPE,
  IDSTYPE,
  LIKEREACTION,
  posttype,
  USER_S_N_TYPE,
} from "../../utils/main/types";

export interface poststatetype {
  likes: number;
  saved: boolean;
  pinned: boolean;
  error: ERRORTYPE;
  liked: LIKEREACTION;
  images: imagetype[];
  inCommunity: boolean;
  commentSortBy: string;
  isOwnerActive: boolean;
  display_user_pic: USER_S_N_TYPE;
  display_community_pic: USER_S_N_TYPE;
}

export type postacttiontype =
  | { type: "SET_IMAGES"; images: imagetype[] }
  | { type: "UPDATE_USER_PIC"; user_pic: string }
  | { type: "UPDATE_COMMUNITY_PIC"; community_pic: string }
  | { type: "PIN_POST"; pinned: boolean }
  | { type: "SAVE_POST"; saved: boolean }
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "SET_LIKES"; likes: number }
  | { type: "SET_LIKED"; liked: LIKEREACTION }
  | { type: "JOIN_COMMUNITY"; inCommunity: boolean }
  | { type: "SET_COMMENT_SORTBY"; sortBy: string }
  | { type: "SET_OWNER_STATUS"; status: boolean }
  | { type: "RESET" };

export type postsaveopxtype = "SAVE" | "PIN";
export type postlikeactiontype = "LIKE" | "DISLIKE";
export type communitytype = { community_id: IDSTYPE };

export interface postpropstype {
  postData: posttype;
  showcommunity: boolean;
}

export type reactedposttype = {
  reaction: LIKEREACTION;
  post_id: IDSTYPE;
};

export type savedposttype = {
  saved: boolean;
  pinned: boolean;
  post_id: IDSTYPE;
};

export interface useractiontype extends IDSTYPE {
  reactedposts: reactedposttype[];
  communities: communitytype[];
  savedposts: savedposttype[];
}
