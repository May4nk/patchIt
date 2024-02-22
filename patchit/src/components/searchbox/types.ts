export interface communities {
  id: number;
  communityname: string;
  description: string;
}

export interface searchdropprops {
  community: communities;
  search?: boolean;
}

export interface searchboxprops {
  showSearchbox: boolean;
  setShowSearchbox: React.Dispatch<React.SetStateAction<boolean>>;
}
