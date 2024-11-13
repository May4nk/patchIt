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
  handlers: string;
}

export type rcommunitypreferencetype = {
  community_name: string;
  id: number;
};
