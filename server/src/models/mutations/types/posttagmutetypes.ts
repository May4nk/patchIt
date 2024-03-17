export interface posttagtype {
  id: number;
  tag_id: number;
  post_id: number;
}

export type rposttagtype = {
  id: number;
}

export interface posttagdatatype {
  data: posttagtype;
}

export interface posttagbatchdatatype {
  data: posttagtype[];
}

export interface remposttagdatatype {
  data: posttagtype;
}

