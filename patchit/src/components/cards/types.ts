import {
  ERRORTYPE,
  popularcardtype,
  posttype,
  STATUS,
} from "../../utils/main/types";

export interface postcardpropstype {
  post: posttype;
}

export type popularcardpropstype = {
  data: popularcardtype;
};

export type zeropostcardcontenttype = {
  title?: string;
  unlock?: string;
  content?: string;
  btntxt?: string;
  link?: string;
  onClick?: () => void;
};

export interface zeropostcardpropstype {
  title?: string;
  content?: zeropostcardcontenttype[];
  openstate: boolean;
}

export interface errorcardpropstype {
  message: ERRORTYPE;
  icn?: string;
  title?: string;
  msgshowtime?: number;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
}

export interface commentcardtype {
  id: number;
  comment: string;
  created_at: string;
  user_id: { username: string; profile_pic: string; status: STATUS };
  parent_id: {
    comment: string;
    user_id: { username: string; status: STATUS };
  };
  post_id: {
    id: number;
    title: string;
    community_id: { communityname: string; profile_pic: string };
    created_at: string;
  };
}

export interface commentcardpropstype {
  comment: commentcardtype;
  extend: boolean;
}
