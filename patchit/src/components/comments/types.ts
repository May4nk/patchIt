import { comments } from "../../containers/types/postpage";

export interface commenttype {
  id: number;
  parent_id: commenttype|null;
  comment: string;
  post_id: { id: number, title: string, community_id: { communityname: string}};
  user_id: { id: number, username: string };
}

export interface newcommenttype {
  user_id: number;
  post_id: number;
  parent_id: number | null;
  comment: string;
}

export interface commentlistprops {
  rootcomments: commenttype[];
  allcomments: Record<number, commenttype[]>;
  setNewComment: any;
  newComment: newcommenttype;
  setParentComment: any;
}

export interface commentprops {
  data: commenttype;
  childcomments: Record<number, commenttype[]>;
  setNewComment: any;
  newComment: newcommenttype;
  setParentComment: any;
}

export interface commentspaceprops {
  postId: number;
  comments: comments[];
}

