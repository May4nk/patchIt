export interface chatBoxprops {
  showChatbox : boolean;
  setShowChatbox: any;
}

export type msgTouser = (roomid: string)  => string;
export interface message {
  msg_to: number;
  msg_from: number;
  message: string;
  room_code: string;
}

export type checkroomexist = (roomname: string) => string;
export type roomexist = string;

