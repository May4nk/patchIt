import { commentcardtype } from "../../components/cards/types";
import { idstype, posttype, PRIVACY, STATUS } from "../../utils/main/types";

export type userpagetabnames = "posts" | "comments" | "reactions" | "saved";

export type userfollowingtype = {
  id: number;
  follower: { id: number; username: string };
  following: { id: number; username: string };
};

export interface reactedposttype {
  reaction: number;
  post_id: posttype;
}

export interface savedposttype {
  saved: boolean;
  pinned: boolean;
  post_id: posttype;
}

export interface userpageusertype {
  id: number;
  email: string;
  username: string;
  privacy: PRIVACY;
  dob: string;
  created_at: string;
  country: string;
  background_pic: string;
  about: string;
  status: STATUS;
  profile_pic: string;
  role: { id: number; role: string };
  social_links: string | null;
  ownedCommunities: {
    id: number;
    communityname: string;
    owner: idstype;
  }[];
  comments: commentcardtype[];
  posts: posttype[];
  settings: { allowppltofollow: boolean; nsfw: boolean };
  savedposts?: savedposttype[];
  reactedposts?: reactedposttype[];
  followers: userfollowingtype[];
}
