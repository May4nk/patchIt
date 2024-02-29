export interface communities {
  id: number;
  communityname: string;
}

export interface createCommunityprops {
  showCreateCommunity : boolean;
  setShowCreateCommunity : React.Dispatch<React.SetStateAction<boolean>>;
}

export interface createcommunitydatatype {
  communityname: string;
  owner: number;
  privacy: string;
  description: string;
  category: string|null;
}

export interface categorytype {
  id: number;
  categoryicon: string;
  categoryname: string;
}

export interface upsertcommunitytype {
  id: number;
  communityname: string;
}