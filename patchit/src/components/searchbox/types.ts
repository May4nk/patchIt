import { IDSTYPE } from "../../utils/main/types";
import { navshowtype } from "../navbar/types";

export interface communitytype extends IDSTYPE {
  about: string;
  name: string;
}

export interface searchdropprops {
  search?: boolean;
  community: communitytype;
}

export interface searchboxprops {
  showSearchbox: boolean;
  setShowSearchbox: navshowtype;
}
