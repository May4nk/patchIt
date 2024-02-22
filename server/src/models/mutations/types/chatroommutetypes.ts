import { chatroomtype } from "../../resolvers/types/chatroomtypes.js";

export type rchatroomtype = {
  id: number;
}

export interface chatroomdatatype {
  data: chatroomtype;
}

export interface remchatroomdatatype {
  data: rchatroomtype;
}

