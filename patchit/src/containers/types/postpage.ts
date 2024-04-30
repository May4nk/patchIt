import { commenttype } from "../../components/comments/types";

interface usertype {
  id: number;
  username: string;
  profile_pic: string;
}

export type reactedposttype = { reaction: number; post_id: { id: number } };
export type savedposttype = { saved: boolean; pinned: boolean; post_id: { id: number } };
export type tagtype = { tag_id: { name: string }};

export interface comments {
  id: number;
  comment: string;
  created_at: string;      
  parent_id: comments;
  user_id: usertype;
}

export interface usersavedtype {
  id: number;
  reactedposts: reactedposttype[];
  savedposts: savedposttype[];
}

export interface postpagetype {
  id: number;
  title: string;
  type: string;
  status: string;
  content: string;
  likes: number;
  created_at: string;
  comments: comments[];
  community_id: { id: number, communityname: string };
  owner: { id: number, profile_pic: string, username: string };
  tags: tagtype[];
}

export interface subdatatype {
  newComment: commenttype[];
}

export interface commentsubtype {
  data: subdatatype
}

export interface commentsubscriptiondatatype {
  subscriptionData: commentsubtype;
}
