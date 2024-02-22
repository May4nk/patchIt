export interface sidenavtabprops {
  icon: string;
  colname: string;
  category?: boolean;
}

export interface categorytype {
  id: number;
  categoryname: string;
  categoryicon: string;
}

export interface communitytype {
  id: number;
  communityname: string;
  category: string;
}