export interface usertype {
  id: number;
  email: string;
  username: string;
  password: string;
  role: string;
  dob: string;
  gender: string;
  country: string;
  about: string;
  status: string;
  token: string;
  new_user: boolean;
  profile_pic: string;
  background_pic: string;
  created_at: string;
}

export interface userfiltertype {
  id: number;
  email: string;
  username: string;
  dob: string;
  role: string;
  gender: string;
  country: string;
  status: string;
  new_user: boolean;
  profile_pic: string;
  background_pic: string;
  created_at: string;
}

