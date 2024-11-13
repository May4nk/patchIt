export type askinputprefixestype = [string, string] | [string];

export interface askinputprops {
  placeholder?: string;
  prefixes?: askinputprefixestype;
  postfix?: string | null;
  required?: boolean;
  maxlength?: number;
  name?: string;
  type?: "color" | "text" | "password" | "number";
  value?: string | number;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onClickPostfix?: React.MouseEventHandler<HTMLInputElement>;
  onClickPrefixTab?: (e?: any) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
}

export interface patpicerpropstype {
  showPic: boolean;
  pics: string[];
  setShowPic: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface patchippropstype {
  title: string;
  img?: string;
  icn?: string;
}

export interface patswitchpropstype {
  name: string;
  checked: boolean;
  onChange: (e: any) => void;
}

export interface htabpropstype {
  tabname: string;
  tabicn?: string;
  handleClick: () => void;
}
