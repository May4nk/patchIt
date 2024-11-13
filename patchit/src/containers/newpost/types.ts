export interface postdatatypes {
  title: string;
  content: string;
  type: string;
  owner: number;
  community_id: number | null;
  privacy: string;
}

export interface postimgtypes {
  id: number;
  postCaption: string;
  postLink: string;
  postSrc: string;
}

export interface communitynametypes {
  id: number;
  communityname: string;
  profile_pic: string;
}

export interface communitytype extends communitynametypes {
  about: string;
  description: string;
  background_pic: string;
  created_at: string;
  posts: { id: number }[];
  users: { id: number }[];
}

export interface tagtype {
  id: number;
  name: string;
}

export interface newpolltype {
  value: string;
  count: number;
}

//img ---------------------------
export interface imagetype {
  id: number;
  postSrc: string;
  postCaption: string;
  postLink: string;
}

export interface posttypeimageprops {
  image: imagetype[];
  currentpreviewImage: number;
  handleRemovepreviewImage: (img_id: number) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setImage: React.Dispatch<React.SetStateAction<imagetype[]>>;
  setCurrentpreviewImage: React.Dispatch<React.SetStateAction<number>>;
}

export interface postpreviewimgpropstype {
  idx: number;
  src: string;
  img_id: number;
  setImg: (id: number) => void;
  handleRemoveImage: (img_id: number) => void;
}

//poll --------------------------
export interface posttypepollprops {
  polls: newpolltype[];
  setPolls: React.Dispatch<React.SetStateAction<newpolltype[]>>;
}

//tags ---------------
export interface tagpropstype {
  info: { id: number; name: string };
  handleClick: (e: any, tagId: number) => void;
}
