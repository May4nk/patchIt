export interface chatpreferencetype {
  id: number;
  owner: number;
  room: string;
  about: string;
  group_profile: string;
  blocked: string;
  allowedmedia: string;
  chatgrouptheme: string;
  admin: String;
  co_admin: String;
  acceptor: String;
  operator: String;
}

export type rchatpreferencetype = {  
  room: string;
};

export interface chatpreferencedatatype {
  data: chatpreferencetype;
}

export interface remchatpreferencedatatype {
  data: rchatpreferencetype;
}
