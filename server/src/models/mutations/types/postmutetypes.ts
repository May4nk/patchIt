import { posttype } from "../../resolvers/types/posttypes.js";

export type rposttype = {
  id: number;
}

export interface postdatatype {
  data: posttype;
}

export interface rempostdatatype {
  data: rposttype;
}

