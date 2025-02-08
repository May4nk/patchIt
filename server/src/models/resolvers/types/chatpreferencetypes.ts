import { usertype } from "./usertypes";
import { chatroomtype } from "./chatroomtypes";
import { CHATMEDIA, IDSTYPE } from "../../../utils/common/types";

export interface chatpreferencetype extends IDSTYPE {
  owner: usertype;
  room: chatroomtype;
  blocked: string;
  about: string;
  group_profile: string;
  allowedmedia: CHATMEDIA;
  chatgrouptheme: String;
  admin: usertype | null;
  co_admin: usertype | null;
  acceptor: usertype | null;
  operator: usertype | null;
}

export interface chatpreferencefiltertype {
  owner: string;
  room: string;
  blocked: string;
  allowedmedia: CHATMEDIA;
  chatgrouptheme: String;
  admin: String;
  co_admin: String;
  acceptor: String;
  operator: String;
}

export interface rawchatpreferencetype
  extends IDSTYPE,
    chatpreferencefiltertype {
  about: string;
  group_profile: string;
}
