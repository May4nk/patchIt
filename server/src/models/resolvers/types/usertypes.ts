import { IDSTYPE, PRIVACY, STATUS } from "../../../utils/common/types";
import { roletype } from "./roletypes";

interface usercommonfields extends IDSTYPE {
  email: string;
  username: string;
  privacy: PRIVACY;
  dob: string;
  gender: string;
  country: string;
  status: STATUS;
  new_user: boolean;
  created_at: string;
}

export interface userfiltertype extends usercommonfields {
  role: number;
}

export interface usertype extends usercommonfields {
  password: string;
  role: roletype;
  about: string;
  token: string;
  social_links: string;
  newPassword?: string;
  profile_pic: string;
  background_pic: string;
}
