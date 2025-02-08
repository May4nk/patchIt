import { IDSTYPE } from "../../../utils/common/types";
import { usertype } from "./usertypes";

export interface userfollowingtype extends IDSTYPE {
  follower: usertype;
  following: usertype;
  created: string;
}

export interface userfollowingfiltertype {
  follower: string;
  following: string;
}

export type rawuserfollowingtype = IDSTYPE & userfollowingfiltertype;

export type remuserfollowingtype = userfollowingfiltertype;
