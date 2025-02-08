import { commenttype } from "../../components/comments/types";
import { infocreatecardtype } from "../../components/infosection/types";
import {
  ERRORTYPE,
  IDSTYPE,
  POSTTYPE,
  usernametype,
} from "../../utils/main/types";

export type tagtype = { tag_id: { name: string } };

export type seterrortype = (error: ERRORTYPE) => void;

export interface postpagetype extends IDSTYPE {
  title: string;
  type: POSTTYPE;
  status: string;
  content: string;
  likes: number;
  created_at: string;
  community_id: infocreatecardtype;
  owner: usernametype;
  tags: tagtype[];
}

export interface subdatatype {
  newComment: commenttype[];
}

export interface commentsubtype {
  data: subdatatype;
}

export interface commentsubscriptiondatatype {
  subscriptionData: commentsubtype;
}
