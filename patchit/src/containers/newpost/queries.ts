import { gql } from "@apollo/client";
import { COMMUNITY_BASIC_FIELDS } from "../queries/community";

export const ALLCOMMUNITIESNAME = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      ...communityBasicFields
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const GETONECOMMUNITY = gql`
  query Community($communityname: String!) {
    community(communityname: $communityname) {
      ...communityBasicFields
      about
      description
      background_pic
      created_at
      posts {
        id
      }
      users {
        id
      }
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const CREATEPOST = gql`
  mutation InsertPost($data: UpsertPostInput) {
    insertPost(data: $data) {
      id
    }
  }
`;

export const ALLTAGS = gql`
  query ListTags {
    listTags {
      id
      name
    }
  }
`;

export const INSERTTAGS = gql`
  mutation BatchInsertPostTags($data: [InsertPostTagsInput!]!) {
    batchInsertPostTags(data: $data) {
      id
    }
  }
`;

export const GETSIGNEDURLS = gql`
  mutation GetSignedUrl($data: SignedUrlInput) {
    getSignedUrl(data: $data) {
      fileUrl
      signedUrl
      req
    }
  }
`;
