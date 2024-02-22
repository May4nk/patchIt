export interface savedposttype {
  id: number;
  pinned: boolean;
  saved: boolean;
  user_id: number;
  post_id: number;
}

export type rsavedposttype = {
  id: number;
}

export interface savedpostdatatype {
  data: savedposttype;
}

export interface remsavedpostdatatype {
  data: rsavedposttype;
}

