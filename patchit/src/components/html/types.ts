export interface askinputprops {
  placeholder? : string;
  prefix? : string;
  postfix? : string | null;
  required? : boolean;
  maxlength? : number; 
  name? : string;
  type? : string;
  value? : string | number;
  onClick? : React.MouseEventHandler<HTMLInputElement>;
  onClickPostfix? : React.MouseEventHandler<HTMLInputElement>;
  onClickPrefixTab? : (e?: any) => void;
  onChange? : (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur? : (e: React.FocusEvent<HTMLElement>) => void;
}
