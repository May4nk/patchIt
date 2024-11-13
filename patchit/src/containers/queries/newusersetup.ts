import { gql } from "@apollo/client";

export const GETPOPULARCOMMUNITIES = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      id
      communityname
      description
      privacy
      status
      profile_pic
    }
  }
`;

export const JOINCOMMUNITYINBATCH = gql`
  mutation BatchInsertUserCommunity($data: [InsertUserCommunityInput!]!) {
    batchInsertUserCommunity(data: $data) {
      id
    }
  }
`;
