import { imagetype } from "../../containers/newpost/types";

export interface postpollprops {
  pollData: string;
  pollPostId: string;
}

export interface postimgprops {
  postImgData: imagetype[];
}

export interface polltype {
  id: number;
  pollvalue: string;
}
