export interface userdatatypes {
  email: string;
  password: string;
  username: string;
}

export interface loginproptypes {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface usertype {
  id: number;
  email: string;
  username: string;
}

export interface tokenusertype extends usertype {
  new_user: boolean;
  role: { id: number };
}

export interface magictokenusertype extends tokenusertype {
  token: string;
}
