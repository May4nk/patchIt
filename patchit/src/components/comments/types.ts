import { idstype, usernametype } from "../../utils/main/types";

export interface parentcommenttype {
  id: number;
  comment: string;
}

export interface commenttype {
  id: number;
  parent_id: parentcommenttype | null;
  comment: string;
  likes: number;
  user_id: usernametype;
  created_at: string;
}

export interface newcommenttype {
  user_id: number;
  post_id: number;
  parent_id: number | null;
  comment: string;
}

export interface commentlistprops {
  newComment: newcommenttype;
  rootcomments: commenttype[];
  allcomments: Record<number, commenttype[]>;
  setNewComment: React.Dispatch<React.SetStateAction<newcommenttype>>;
  setParentComment: React.Dispatch<
    React.SetStateAction<parentcommenttype | undefined>
  >;
}

export interface commentprops {
  data: commenttype;
  newComment: newcommenttype;
  childcomments: Record<number, commenttype[]>;
  setNewComment: React.Dispatch<React.SetStateAction<newcommenttype>>;
  setParentComment: React.Dispatch<
    React.SetStateAction<parentcommenttype | undefined>
  >;
}

export interface commentspaceprops {
  postId: number;
  comments: commenttype[];
}

export type handleparentidtype = (
  parentId: number,
  parentComment: string
) => void;

export interface listusercommentliketype {
  id: number;
  user_id: idstype;
  comment_id: idstype;
}
