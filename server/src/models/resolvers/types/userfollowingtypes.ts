import { usertype } from "./usertypes";

export interface userfollowingtype {
  id: number;
  follower: usertype;
  following: usertype;
  created: string;
}

export interface userfollowingfiltertype {
  follower: number;
  following: number;
}
