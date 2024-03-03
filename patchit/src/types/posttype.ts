interface communitytype {
  id: number;
  communityname: string;
  profile_pic: string;
}

interface ownertype {
  id: number;
  username: string;
  profile_pic: string;
}

type STATUS = "PUBLIC" | "PRIVATE";

type TYPE = "BLOG" | "IMAGE" | "LINK" | "POLL";

export interface posttype {
  id: number;
  title: string;
  type: TYPE;
  content?: string;
  status: STATUS;
  likes: number;
  owner: ownertype;  
  comments: { id: number }[];
  community_id: communitytype;
  created_at: string;
}

export interface homeposttype {
  community_id: { posts: posttype[] };
}
