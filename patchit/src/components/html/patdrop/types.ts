export type actiontype = "CURRENT" | "CLICKED" | "INPUT" | "DEFAULT" | "LINKED";

export const ACTION: Record<actiontype, string> = {
  CURRENT: "current",
  CLICKED: "clicked",
  INPUT: "input",
  DEFAULT: "default",
  LINKED: "linked",
};

interface patdropstate {
  img?: string;
  icn?: string;
  name?: string;
  state?: actiontype;
}

export interface profiletype extends patdropstate {
  set?: string;
  title?: string;
  meta?: profiletype;
  placeholder?: string;
}

export interface droppertype extends patdropstate {
  title: string;
  link?: string;
  last?: boolean;
  text?: boolean;
  event?: (e?: any) => void;
}

export interface patdropprops {
  profile: profiletype;
  droppers: droppertype[];
  searchinto?: droppertype[];
  name?: string;
}

export interface patprofileprops {
  patInput: string;
  dropped: boolean;
  profile: profiletype;
  activeState: actiontype;
  setDropped: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveState: React.Dispatch<React.SetStateAction<actiontype>>;
  setPatInput: React.Dispatch<React.SetStateAction<string>>;
}

export interface patdropperprops {
  dropped: droppertype;
  handleClick: (e?: any) => void;
}

export type currentstatetype = { icn: string; title: string };
