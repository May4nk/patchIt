import {
  ERRORTYPE,
  IDSTYPE,
  popularcardtype,
  posttype,
  STATUS,
} from "../../utils/main/types";

//post card
export interface postcardpropstype {
  post: posttype;
}

//popular card
export type popularcardpropstype = {
  data: popularcardtype;
};

//zero post card
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
  openstate?: boolean;
}

//error card
export interface errorcardpropstype {
  message: ERRORTYPE;
  icn?: string;
  title?: string;
  msgshowtime?: number;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
}

//comment card
export interface commentcardtype extends IDSTYPE {
  text: string;
  created_at: string;
  user_id: { username: string; profile_pic: string; status: STATUS };
  parent_id: {
    text: string;
    user_id: { username: string; status: STATUS };
  };
  post_id: IDSTYPE & {
    title: string;
    community_id: { name: string; profile_pic: string };
    created_at: string;
  };
}

export interface commentcardpropstype {
  comment: commentcardtype;
  extend: boolean;
}
