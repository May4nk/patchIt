import { IDSTYPE, NOTIFYSTATUS, NOTIFYTYPE } from "../../../utils/common/types";
import { usertype } from "./usertypes";

export interface notificationtype extends IDSTYPE {
  type: NOTIFYTYPE;
  message: string;
  status: NOTIFYSTATUS;
  touser: usertype;
  fromuser: usertype;
}

export interface rnotificationtype {
  touser: string;
  fromuser: string;
  type: NOTIFYTYPE;
}

export interface notificationfiltertype extends IDSTYPE, rnotificationtype {
  status: NOTIFYSTATUS;
}

export interface rawnotificationtype extends notificationfiltertype {
  text: string;
}
