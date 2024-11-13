import { gql } from "@apollo/client";

const COMMON_POST_FIELDS = gql`
  fragment CommonPostFields on Post {
    id
    title
    type
    content
  }
`;

export const GETALLPOSTS = gql`
  query ListPosts($filter: PostfilterInput, $sort: [SortInput], $limit: Int) {
    listPosts(filter: $filter, sort: $sort, limit: $limit) {
      ...CommonPostFields
      likes
      status
      created_at
      owner {
        id
        username
        profile_pic
        status
      }
      community_id {
        id
        communityname
        profile_pic
      }
      comments {
        id
      }
    }
  }
  ${COMMON_POST_FIELDS}
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
