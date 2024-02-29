export interface communitypreferencetype {
  id: number;
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

export type rcommunitypreferencetype = {
  community_name: string;
  id: number;
}

export interface communitypreferencedatatype {
  data: communitypreferencetype;
}

export interface remcommunitypreferencedatatype {
  data: rcommunitypreferencetype;
}

