import { gql } from "@apollo/client";

export const CREATECOMMUNITY = gql`
mutation CreateCommunity($data: UpsertCommunityInput) {
  upsertCommunity(data: $data) {
    id
    communityname
  }
}
`;

export const COMMUNITIESNAME = gql`
query ListCommunities($filter: CommunitiesfilterInput) {
  listCommunities(filter: $filter) {
    id
    communityname
  }
}
`;

export const GETCATEGORIES = gql `
query ListCategories {
  listCategories {
    id
    categoryname
    categoryicon
  }
}
`;
