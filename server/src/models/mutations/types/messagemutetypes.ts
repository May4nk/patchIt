import { messagetype } from "../../resolvers/types/messagetypes.js";

export type rmessagetype = {
  id: number;
}

export interface messagedatatype {
  data: messagetype;
}

export interface remmessagedatatype {
  data: rmessagetype;
}

