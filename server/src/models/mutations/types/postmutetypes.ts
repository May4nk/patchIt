import { REQTYPE, signedfiletype } from "../../../services/types";

export interface signedurldata {
  data: {
    files: signedfiletype[];
    req: REQTYPE;
    postId: string;
    userId: string;
  };
}
