import { usertype } from "./usertypes";
import { chatroomtype } from "./chatroomtypes";

export interface chatpreferencetype {
  id: number;
  owner: usertype;
  room: chatroomtype;
  blocked: string;
  about: string;
  group_profile: string;
  allowedmedia: String;
  chatgrouptheme: String;
  admin: usertype | null;
  co_admin: usertype | null;
  acceptor: usertype | null;
  operator: usertype | null;
}

export interface chatpreferencefiltertype {
  owner: number;
  room: string;
  blocked: string;
  allowedmedia: String;
  chatgrouptheme: String;
  admin: String;
  co_admin: String;
  acceptor: String;
  operator: String;
}
