import { IDSTYPE } from "../../../utils/common/types";
import { communitytype } from "./communitiestypes";
import { usertype } from "./usertypes";

interface communitypreference {
  nsfw: boolean;
  allowppltofollow: boolean;
  newuserreq: boolean;
  reportonpost: boolean;
  reportoncmnt: boolean;
  reportonuser: boolean;
  activityincommunity: boolean;
  birthday: boolean;
}

export interface communitypreferencetype extends communitypreference, IDSTYPE {
  community_name: string;
  handlers: string;
}

export interface communitypreferenceresolvertype
  extends communitypreference,
    IDSTYPE {
  community_name: communitytype;
  handers: usertype[];
}

export interface communitypreferencefiltertype extends communitypreference {
  community_name: string;
}

export interface rawcommunitypreferencetype
  extends communitypreferencefiltertype,
    IDSTYPE {
  handlers: string;
}

export type rcommunitypreferencetype = IDSTYPE & {
  community_name: string;
};
