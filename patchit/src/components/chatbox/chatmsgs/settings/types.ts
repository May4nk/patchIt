import { usernametype } from "../../../../utils/main/types";
import {
  chatboxstatetype,
  chatgroupusertype,
  updatechatroompreferencestype,
} from "../../types";

export interface chatgroupadminprops {
  roomSettings: chatboxstatetype["roomInfo"];
  updateSettings: () => Promise<void>;
  updateRoomSettings: updatechatroompreferencestype;
}

export interface chatgroupblockedprops {
  userId: string;
  inmates: usernametype[];
  updateSettings: () => Promise<void>;
  roomSettings: chatboxstatetype["roomInfo"];
  updateRoomSettings: updatechatroompreferencestype;
}

export interface chatgrouprequestsprops {
  inmates: usernametype[];
  newinmates: chatgroupusertype[];
}

export interface chatgrouphandlersprops {
  inmates: usernametype[];
  updateSettings: () => Promise<void>;
  updateRoomSettings: updatechatroompreferencestype;
}
