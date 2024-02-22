import { tagtype } from "../../resolvers/types/tagtypes.js";

export type rtagtype = {
  id: number;
}

export interface tagdatatype {
  data: tagtype;
}

export interface remtagdatatype {
  data: rtagtype;
}

