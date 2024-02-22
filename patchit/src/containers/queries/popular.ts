import { gql } from "@apollo/client";

export const GETPOPULARCARDPOSTS = gql`
query ListPosts($filter: PostfilterInput, $sort: [SortInput], $limit: Int) {
  listPosts(filter: $filter, sort: $sort, limit: $limit) {
    id,
    title,
    type,
    content
  }
}
`;

