export interface profilestatetype{ 
  nsfw: boolean; 
}

export interface privacystatetype {           
  allowppltofollow: boolean;  
}

export interface communitystatetype {
  profile_pic: string;
  background_pic: string;
  about: string;
  description: string;
  privacy: string;
}

export interface notificationsstatetype { 
  newuserreq: boolean;   
  reportonpost: boolean; 
  reportoncmnt: boolean; 
  reportonuser: boolean; 
  activityincommunity: boolean; 
  birthday: boolean;   
}
