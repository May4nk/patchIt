export type REQTYPE = "GET" | "PUT";

export type signedurltype = {
  signedUrl: string;
  fileUrl: string;
  req: REQTYPE;
};

export type signedfiletype = {
  name: string;
  type?: string;
};

export type generatepresignedfilestype = {
  files: signedfiletype[];
  req: REQTYPE;
  postId: string;
  userId: string;
};

export type generatepresignedurlstype = (
  data: generatepresignedfilestype
) => Promise<signedurltype[]>;
