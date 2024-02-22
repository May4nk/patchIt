import { posttype } from "../../types/posttype";

export interface postprops {
  postData: posttype;
  showcommunity: boolean;
}

export interface parsedimgtype {
  id: number;
  postSrc: string;
  postCaption?: string;
  postLink?: string;
}

export type reactposttype = { reaction: number; post_id: { id: number } };
export type communitytype = { community_id: { id: number; } };
export type savedposttype = { saved: boolean; pinned: boolean; post_id: { id: number; } };

export interface useractiontype {
  id: number;
  reactedposts: reactposttype[];
  communities: communitytype[];
  savedposts: savedposttype[]; 
}

export type postdblikestype = (userreact: number, type: string, postlikenumber: number) => void;