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

export interface communitypreferencetype extends communitypreference {
  id: number;
  handlers: string;
}

export interface communitypreferenceresolvertype extends communitypreference {
  id: number;
  community_name: communitytype;
  handers: usertype[];
}

export interface communitypreferencefiltertype extends communitypreference {
  community_name: string;
}
