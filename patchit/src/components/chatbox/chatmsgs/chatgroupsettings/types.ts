import { chatgroupusertype } from "../../types";
import { usernametype } from "../../../../utils/main/types";
import { ACTION, chatroominfotype } from "../../../../utils/types";

export interface chatgroupadminprops {
  roomSettings: chatroominfotype;
  updateSettings: () => Promise<void>;
  updateRoomSettings: (value: ACTION) => void;
}

export interface chatgroupblockedprops {
  userId: number;
  inmates: usernametype[];
  roomSettings: chatroominfotype;
  updateSettings: () => Promise<void>;
  updateRoomSettings: (value: ACTION) => void;
}

export interface chatgrouprequestsprops {
  inmates: usernametype[];
  newinmates: chatgroupusertype[];
}

export interface chatgrouphandlersprops {
  inmates: usernametype[];
  roomSettings: chatroominfotype;
  updateSettings: () => Promise<void>;
  updateRoomSettings: (value: ACTION) => void;
}
