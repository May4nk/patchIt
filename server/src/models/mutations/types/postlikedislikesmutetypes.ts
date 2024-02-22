
export interface postlikedislikestype {
  id: number;
  post_id: number;
  user_id: number;
  reaction: number;
}

export type rpostlikedislikestype = {
  id: number;
}

export interface postlikedislikesdatatype {
  data: postlikedislikestype;
}

export interface rempostlikedislikesdatatype {
  data: postlikedislikestype;
}
