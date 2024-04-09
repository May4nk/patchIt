type idstype = { id: number };

interface posttype {
  id: number;
  title: string;
  type: string;
  owner: { id: number; profile_pic: string; username: string; };
  content: string;
  created_at: string;
  likes: number;
  status: string;  
}

interface userposttype extends posttype {
  community_id: { 
    id: number; 
    communityname: string; 
    profile_pic: string 
  };
}

export interface communitypatcherdatatype {
  id: number;
  communityname: string ;
  owner: { id: number };
}

interface userdatatype {
  id: number;
  about: string;
  created_at: string;
  username: string;
  background_pic: string;
  profile_pic: string;
  posts: userposttype[];
}

interface communitydatatype {
  id: number;
  about: string;
  themecolour: string;
  background_pic: string;
  profile_pic: string;
  created_at: string;
  posts: posttype[];
  users: { id: number, user_id: { id: number } }[];
}

interface infoaboutuserprops {
  data: userdatatype;
  userdata: true;
}

interface infoaboutcommunityprops {
  data: communitydatatype;
  userdata: false;
}

export type infoaboutprops = infoaboutcommunityprops | infoaboutuserprops;

export interface infosectionprops {
  communitypatcherdata?: communitypatcherdatatype[];
}

export interface infouserscommunityprops {
  communitypatcherdata: communitypatcherdatatype[];
}

// infotab type ----------------------------------------
interface communitytype {
  id: number;
  communityname: string;
  posts: idstype[];
  users: idstype[];
  profile_pic: string;
}

export interface infotabprops {
  community: communitytype;
}

// inforecommended type ------------------------------------------
export interface recommendedposttype {
  id: number;
  likes: number;
  title: string;
  type: string;
  owner: idstype & { username: string };
  comments: idstype[];
  community_id: idstype & { communityname: string, profile_pic: string };
}

// infocreatecard type ----------------------------------
interface createcardtype {
  id: number;
  description: string;
  communityname: string;
  background_pic: string;
  profile_pic: string;
  created_at: string;
  posts: idstype[];
  users: idstype[];
}

export interface infocreatecardprops {
  data: createcardtype;
}
