import { commenttype } from "../../resolvers/types/commenttypes.js";

export type rcommenttype = {
  id: number;
}

export interface commentdatatype {
  data: commenttype;
}

export interface remcommentdatatype {
  data: rcommenttype;
}

