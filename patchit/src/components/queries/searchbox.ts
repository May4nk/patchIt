import { gql } from "@apollo/client";

export const COMMUNITIESNAME = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      id
      name
      about
    }
  }
`;
