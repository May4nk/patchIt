export type NOTIFICATIONTYPE = "CHAT" | "FRIEND";

export interface notificationtype {
  id: number;
  touser: number;
  fromuser: number;
  status: string;
  message: string;
  type: NOTIFICATIONTYPE;
}

export interface rnotificationtype {
  touser: number;
  fromuser: number;
  type: NOTIFICATIONTYPE;
}
