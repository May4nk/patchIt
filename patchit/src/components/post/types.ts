export interface postpollprops {
  pollData: string;
  pollPostId: number;
}

export interface parsedimgtype {
  id: number;
  postSrc: string;
  postCaption?: string;
  postLink?: string;
}

export interface postimgprops {
  postImgData: parsedimgtype[];
}

export interface polltype {
  id: number;
  pollvalue: string;
}
