import { gql } from "@apollo/client";
import { COMMUNITY_BASIC_FIELDS } from "./community";

export const GETPOPULARCOMMUNITIES = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      ...communityBasicFields
      description
      privacy
      status
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const JOINCOMMUNITYINBATCH = gql`
  mutation BatchInsertUserCommunity($data: [InsertUserCommunityInput!]!) {
    batchInsertUserCommunity(data: $data) {
      id
    }
  }
`;
