import { communitytype } from "./communitiestypes";

export interface communitypreferencetype {
  id: number;
  community_name: communitytype; 
  nsfw: boolean;
  allowppltofollow: boolean;
  newuserreq: boolean;
  reportonpost: boolean;
  reportoncmnt: boolean;
  reportonuser: boolean;
  activityincommunity: boolean;
  birthday: boolean;
}

export interface communitypreferencefiltertype {
  community_name: string; 
  nsfw: boolean;
  allowppltofollow: boolean;
  newuserreq: boolean;
  reportonpost: boolean;
  reportoncmnt: boolean;
  reportonuser: boolean;
  activityincommunity: boolean;
  birthday: boolean;
}

