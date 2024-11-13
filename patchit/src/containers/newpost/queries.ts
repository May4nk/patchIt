import { gql } from "@apollo/client";

export const ALLCOMMUNITIESNAME = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      id
      communityname
      profile_pic
    }
  }
`;

export const GETONECOMMUNITY = gql`
  query Community($communityname: String!) {
    community(communityname: $communityname) {
      id
      about
      description
      communityname
      background_pic
      profile_pic
      created_at
      posts {
        id
      }
      users {
        id
      }
    }
  }
`;

export const UPSERTPOST = gql`
  mutation Mutation($data: UpsertPostInput) {
    upsertPost(data: $data) {
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
