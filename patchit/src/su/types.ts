import { droppertype } from "../components/html/patdrop/types";

export type tablenames = "posts"|"roles"|"users"|"communities"|"categories"|"chats";
export type tablecolumntype = Record<tablenames, droppertype[]>;

export interface categorytype {
  id: number;
  categoryname: string;
  created_at: string;
}

export interface chatroomtype {
  id: number;
  room_code: string;
  created_at: string;
}

export interface roletype {
  id: number;
  role: string;
  access: string
  created_at: string;
}

export interface usertype {
  id: number;
  username: string;
  profile_pic: string;
  email: string;
  about: string;
  status: string;
  role: roletype;
  dob: string;
  created_at: string;
}

export interface posttype {
  id: number;
  content: string;
  type: string;
  title: string;
  likes: number;
  status: string;
  community_id: { communityname: string };
  owner: { username: string; };
  created_at: string;
  comments: { id: number }[];
}

export interface communitytype {
  id: number;
  communityname: string;
  profile_pic: string;
  description: string;
  privacy: string;
  status: string;
  created_at: string;
  theme: string;
  users: { id: number }[];
  owner: { username: string };
}

export interface supostprops {
  post: posttype;
}

export interface suuserprops {
  user: usertype;
}

export interface sucommunityprops {
  community: communitytype;
}

export type wheretype = { column: string; value: string; };
export type ordertype = { order: string; column: string; nulls: string; };

export interface suqueryformprops {
  tablename: string;
  handleSubmit: (e: any) => void;  
  where: wheretype[];
  setWhere: React.Dispatch<React.SetStateAction<wheretype[]>>;
  limitState: boolean;
  setLimitState: React.Dispatch<React.SetStateAction<boolean>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>; 
  orderState: boolean;
  setOrderState: React.Dispatch<React.SetStateAction<boolean>>;
  orderby: ordertype[];
  setOrderBy: React.Dispatch<React.SetStateAction<ordertype[]>>;
}

