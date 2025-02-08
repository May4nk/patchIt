import { gql } from "@apollo/client";
import { COMMUNITY_BASIC_FIELDS } from "../../containers/queries/community";

export const GETCATEGORIES = gql`
  query ListCategories(
    $sort: [SortInput]
    $filter: CategoriesfilterInput
    $limit: Int
  ) {
    listCategories(sort: $sort, filter: $filter, limit: $limit) {
      id
      categoryname
      categoryicon
    }
  }
`;

export const GETCOMMUNITIES = gql`
  query ListCommunities(
    $limit: Int
    $sort: [SortInput]
    $filter: CommunitiesfilterInput
  ) {
    listCommunities(limit: $limit, sort: $sort, filter: $filter) {
      ...communityBasicFields
      profile_pic
      owner {
        id
      }
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;
