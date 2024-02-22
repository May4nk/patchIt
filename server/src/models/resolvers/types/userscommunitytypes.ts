import { usertype } from "./usertypes";
import { communitytype } from "./communitiestypes";

export interface userscommunitytype {
  id: number;
  user_id: usertype;
  community_id: communitytype;
}

export interface userscommunityfiltertype {
  user_id: number;
  community_id: number;
}
