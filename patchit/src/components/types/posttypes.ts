import { posttype } from "../../utils/main/types";

export type postsaveopxtype = "SAVE" | "PIN";
export type postlikestatetype = -1 | 0 | 1; // -1: dislike, 0: none, 1: like
export type postlikeactiontype = "LIKE" | "DISLIKE";
export type communitytype = { community_id: { id: number } };

export interface postprops {
  postData: posttype;
  showcommunity: boolean;
}

export type reactedposttype = {
  reaction: postlikestatetype;
  post_id: { id: number };
};

export type savedposttype = {
  saved: boolean;
  pinned: boolean;
  post_id: { id: number };
};

export interface useractiontype {
  id: number;
  reactedposts: reactedposttype[];
  communities: communitytype[];
  savedposts: savedposttype[];
}
