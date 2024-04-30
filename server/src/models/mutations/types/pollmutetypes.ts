export interface polltype {
  id: number;
  post_id: number;
  user_id: number;
  pollvalue: string;
}

export type rpolltype = {
  id: number;
};

export interface polldatatype {
  data: polltype;
}

export interface rempolldatatype {
  data: polltype;
}
