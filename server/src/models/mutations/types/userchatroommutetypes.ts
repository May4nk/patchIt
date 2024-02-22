import { userchatroomtype } from "../../resolvers/types/userchatroomtypes.js";

export type ruserchatroomtype = {
  id: number;
}

export interface userchatroomdatatype {
  data: userchatroomtype[];
}

export interface remuserchatroomdatatype {
  data: ruserchatroomtype;
}

