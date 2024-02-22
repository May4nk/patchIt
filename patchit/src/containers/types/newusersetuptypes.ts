export interface communitytype {   
  id: number;
  communityname: string;
  description: string;     
  privacy: string;
  status: string;
  profile_pic: string;     
}

export interface selectedcommunitytype {
  user_id: number;
  community_id: number;
}

export interface newusersetupprops {
  newUser: boolean;
}

export interface newusersetuptype {
  id: number|null;
  about: string;
  background_pic: string;
  profile_pic: string; 
  new_user: boolean;
}
