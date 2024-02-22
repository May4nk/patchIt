export type actiontype = "CURRENT"|"CLICKED"|"INPUT"|"DEFAULT"|"LINKED";

export const ACTION: Record<actiontype, string> = {
  "CURRENT": "current",
  "CLICKED": "clicked",
  "INPUT": "input",
  "DEFAULT": "default",
  "LINKED": "linked",
};

export interface statetype {
  title?: string;
  img?: string;
  icn?: string;
  meta?: profiletype;
  search?: string;
}

export type profiletype = {
  title?: string;
  img?: string;
  icn?: string;
  meta?: profiletype;
  name?: string;
  placeholder?: string;
  search?: string;
  state?: string;
}

export type droppertype = { 
  value: string;
  img?: string; 
  icn?: string;
  state?: string;
  link?: string;
  event?: (e?: any) => void;
  last?: boolean;
  text?: boolean;
}

export interface patdropprops {
  profile: profiletype;
  droppers: droppertype[];  
  searchinto?: droppertype[];
}

export interface patprofileprops {
  profile: profiletype;
  dropped: boolean;
  setDropped: React.Dispatch<React.SetStateAction<boolean>>;
  activeState: string;
  setActiveState: React.Dispatch<React.SetStateAction<string>>;
  profileDispatch: React.Dispatch<{type: string; payload: any; }>;  
}

export interface patdropperprops {
  dropped: droppertype;
  handleClick: (e?: any) => void;
}

export type currentstatetype = { icn: string, title: string };