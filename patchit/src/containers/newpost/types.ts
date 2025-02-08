import { ERRORTYPE, IDSTYPE, POSTTYPE } from "../../utils/main/types";

export interface postdatatype {
  title: string;
  content: string;
  type: POSTTYPE;
  community_id: number | null;
}

export interface genretype {
  tabname: POSTTYPE;
  tabicn: string;
}

export interface communitynametypes {
  id: number;
  name: string;
  profile_pic: string;
}

export interface postimagetype {
  postSrc: File;
  postCaption: string;
  postLink: string;
}

export interface imagetype {
  postSrc: string;
  postCaption: string;
  postLink: string;
}

export interface communitytype extends communitynametypes {
  about: string;
  description: string;
  background_pic: string;
  created_at: string;
  posts: IDSTYPE[];
  users: IDSTYPE[];
}

export interface posttagtype {
  id: number;
  name: string;
}

export interface postpolltype {
  value: string;
  count: number;
}

export interface newpoststatetype {
  postData: postdatatype;
  postPolls: postpolltype[];
  postImages: postimagetype[];
  postTags: number[];
  selectedCommunity: string;
  error: ERRORTYPE;
  uploadProgress: number;
}

export type newpostactiontype =
  | {
      type: "SET_POSTDATA_FIELD";
      field: keyof postdatatype;
      value: postdatatype[keyof postdatatype];
    }
  | { type: "ADD_POLLS"; polls: postpolltype[] }
  | { type: "DEL_POLL"; pollIdx: number }
  | { type: "ADD_IMAGES"; images: postimagetype[] }
  | { type: "DEL_IMAGE"; imgIdx: number }
  | { type: "ADD_TAG"; tagId: number }
  | { type: "DEL_TAG"; tagId: number }
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_COMMUNITY"; payload: string }
  | { type: "RESET" };

//img ---------------------------
export interface posttypeimageprops {
  images: postimagetype[];
  setImages: React.Dispatch<newpostactiontype>;
}

export interface postpreviewimgpropstype {
  src: File;
  img_id: number;
  handleRemoveImage: (img_id: number) => void;
  setImg: React.Dispatch<React.SetStateAction<number | null>>;
}

//poll --------------------------
export interface posttypepollprops {
  polls: postpolltype[];
  setPolls: React.Dispatch<newpostactiontype>;
}

//tags ---------------
export interface tagpropstype {
  info: { id: number; name: string };
  handleClick: (e: any, tagId: number) => void;
}
