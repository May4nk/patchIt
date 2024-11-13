import { droppertype, profiletype } from "../html/patdrop/types";

export type socialnames =
  | "whatsapp"
  | "twitter"
  | "telegram"
  | "facebook"
  | "github"
  | "reddit"
  | "insta";

export interface socialchiptype {
  socialData: { name: socialnames; link: string };
}

export type sociallinktype = Record<socialnames, string>;

export interface socialchippropstype extends socialchiptype {
  handleClick: (name: socialnames) => void;
}

export interface blockedboxpropstype {
  title?: string;
  blockedUsers: string | null;
  setShowBlockedBox: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface settingtabpropstype {
  title: string;
  type: "drop" | "switch";
  name?: string;
  value?: boolean;
  metatitle?: string;
  handleChange?: (e: any) => void;
  droppers?: droppertype[];
  dropperProfile?: profiletype;
}

export interface socialboxpropstype {
  socialMediaLinks: string | null;
  handleUpdate: (toUpdate?: string) => void;
  setShowSocialBox: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdatedLinks: React.Dispatch<React.SetStateAction<string>>;
}

export interface textboxpropstype {
  name: string;
  value: string;
  placeholder?: string;
  handleChange: (e?: any) => void;
  handleUpdate: (toUpdate?: string) => void;
  setShowTextBox: React.Dispatch<React.SetStateAction<boolean>>;
}
