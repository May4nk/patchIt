import { posttype } from "../../types/posttype";

type parenttype = { id: number, comment: string, status: string };

export interface reactedposttype {
  reaction: number;
  post_id: posttype;
}

type commentposttype = { id: number, title: string; community_id: { communityname:string }};
    
export interface commenttype {
  parent_id: parenttype;
  comment: string;
  post_id: commentposttype;
}

export interface savedposttype {
  saved: boolean;
  pinned: boolean;
  post_id: posttype;
}
