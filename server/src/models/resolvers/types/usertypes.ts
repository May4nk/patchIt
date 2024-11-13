export interface usertype {
  id: number;
  email: string;
  username: string;
  password: string;
  role: number;
  dob: string;
  gender: string;
  country: string;
  about: string;
  status: string;
  token: string;
  social_links: string;
  new_user: boolean;
  newPassword?: string;
  profile_pic: string;
  background_pic: string;
  created_at: string;
}

export interface userfiltertype {
  id: number;
  email: string;
  username: string;
  dob: string;
  role: number;
  gender: string;
  country: string;
  status: string;
  new_user: boolean;
  profile_pic: string;
  background_pic: string;
  created_at: string;
}
