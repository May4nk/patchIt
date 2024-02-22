import { communitytype } from "../../resolvers/types/communitiestypes.js";

export type rcommunitytype = {
  id: number;
}

export interface communitydatatype {
  data: communitytype;
}

export interface remcommunitydatatype {
  data: rcommunitytype;
}

