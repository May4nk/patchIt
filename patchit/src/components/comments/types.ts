import { IDSTYPE, USER_S_N_TYPE, usernametype } from "../../utils/main/types";
import { seterrortype } from "../chatbox/types";

export interface parentcommenttype extends IDSTYPE {
  text: string;
}

export interface commenttype extends parentcommenttype {
  likes: number;
  created_at: string;
  user_id: usernametype;
  parent_id: parentcommenttype | null;
}

export interface newcommenttype {
  text: string;
  user_id: string;
  post_id: string;
  parent_id: USER_S_N_TYPE;
}

export type commentstatetype = {
  addComment: boolean;
  newComment: newcommenttype;
  parentComment: parentcommenttype | null;
};

export type commentstateactiontype =
  | { type: "ADD_COMMENT"; addComment: boolean }
  | { type: "NEW_COMMENT"; comment: Partial<newcommenttype> }
  | { type: "ADD_PARENT_COMMENT"; comment: parentcommenttype }
  | { type: "RESET" };

export type handlecommentstatetype = (
  state: commentstatetype,
  action: commentstateactiontype
) => commentstatetype;

//comment list----------------------------------------
export interface commentlistprops {
  setError: seterrortype;
  rootcomments: commenttype[];
  commentState: commentstatetype;
  allcomments: Record<number, commenttype[]>;
  setCommentState: React.Dispatch<commentstateactiontype>;
}

//comment --------------------------------------
export interface commentprops {
  data: commenttype;
  setError: seterrortype;
  commentState: commentstatetype;
  childcomments: Record<number, commenttype[]>;
  setCommentState: React.Dispatch<commentstateactiontype>;
}

export interface commentspaceprops {
  postId: string;
  setError: seterrortype;
  comments: commenttype[];
}

export type handleparentidtype = (
  parentId: string,
  parentComment: string
) => void;

export interface listusercommentliketype extends IDSTYPE {
  user_id: IDSTYPE;
  comment_id: IDSTYPE;
}
