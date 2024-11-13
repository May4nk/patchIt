export interface communitytype {
  id: number;
  about: string;
  communityname: string;
}

export interface searchdropprops {
  search?: boolean;
  community: communitytype;
}

export interface searchboxprops {
  showSearchbox: boolean;
  setShowSearchbox: React.Dispatch<React.SetStateAction<boolean>>;
}
