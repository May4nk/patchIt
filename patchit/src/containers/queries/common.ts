import { gql } from "@apollo/client";
import { CORE_POST_FIELDS } from "../../utils/main/fragments";

const COMMON_POST_FIELDS = gql`
  fragment CommonPostFields on Post {
    id
    title
    type
    content
  }
`;

export const GETPOPULARCARDPOSTS = gql`
  query ListPopularCards(
    $filter: PostfilterInput
    $sort: [SortInput]
    $limit: Int
  ) {
    listPosts(filter: $filter, sort: $sort, limit: $limit) {
      ...CommonPostFields
    }
  }
  ${COMMON_POST_FIELDS}
`;

export const GETALLPOSTS = gql`
  query ListPosts($filter: PostfilterInput, $sort: [SortInput], $limit: Int) {
    listPosts(filter: $filter, sort: $sort, limit: $limit) {
      ...CorePostFields
    }
  }
  ${CORE_POST_FIELDS}
`;
