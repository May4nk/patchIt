import { usertype } from "./usertypes";
import { communitytype } from "./communitiestypes";
import { IDSTYPE } from "../../../utils/common/types";

export interface userscommunitytype {
  id: string;
  user_id: usertype;
  community_id: communitytype;
}

export interface userscommunityfiltertype {
  user_id: string;
  community_id: string;
}

export type rawusercommunitytype = IDSTYPE & userscommunityfiltertype;

export type remusercommunitytype = userscommunityfiltertype;
