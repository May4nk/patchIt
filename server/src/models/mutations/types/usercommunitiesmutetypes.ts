export interface usercommunitytype {
  id: number;
  user_id: number;
  community_id: number;
}

export type rusercommunitytype = {
  id: number;
}

export interface usercommunitydatatype {
  data: usercommunitytype;
}

export interface usercommunitybatchdatatype {
  data: usercommunitytype[];
}

export interface remusercommunitydatatype {
  data: usercommunitytype;
}

