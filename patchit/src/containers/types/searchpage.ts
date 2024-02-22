export interface communitytype {
  id: number;
  communityname: string;
  profile_pic: string;
  privacy: string;
  description: string;
  status: string;
  theme: string;
  users: { id: number }[];
  posts: { id: number }[];
}

export interface usertype {
  id: string;
  email: string;
  username: string;
  profile_pic: string;
  about: string;
  status: string;
  posts: { id: number }[];
}

export interface commenttype {
  id: number;
  comment: string;
  created_at: string;
  user_id: { username: string; };
  parent_id: { 
    id: number;
    comment: string;
    user_id: { username: string; };
    created_at: string;
  };
  post_id: { 
    id: number; 
    title: string; 
    community_id: { communityname: string; } 
  };
}