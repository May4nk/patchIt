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
  privacy: string;
  status: boolean;
  profile_pic: string;
}

export interface communitytype extends communitynametypes{
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
