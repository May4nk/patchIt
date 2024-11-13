import { NOTIFICATIONTYPE } from "../../mutations/types/notificationmutetypes";
import { usertype } from "./usertypes";

export interface notificationtype {
  id: number;
  type: NOTIFICATIONTYPE;
  message: string;
  status: string;
  touser: usertype;
  fromuser: usertype;
}

export interface notificationfiltertype {
  id: number;
  type: NOTIFICATIONTYPE;
  status: string;
  touser: number;
  fromuser: number;
}
