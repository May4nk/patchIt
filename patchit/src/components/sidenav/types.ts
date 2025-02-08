import { IDSTYPE, USER_S_N_TYPE } from "../../utils/main/types";

export interface sidenavtabprops {
  icon: string;
  colname: string;
  category?: boolean;
}

export interface categorytype extends IDSTYPE {
  categoryname: string;
  categoryicon: string;
}

export interface communitytype extends IDSTYPE {
  name: string;
  owner: IDSTYPE;
  category: string;
  profile_pic: USER_S_N_TYPE;
}
