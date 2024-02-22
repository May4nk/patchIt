import { gql } from "@apollo/client";

export const GETALLPOSTS = gql`
query ListPosts($filter: PostfilterInput, $sort: [SortInput], $limit: Int) {
  listPosts(filter: $filter, sort: $sort, limit: $limit) {
    id
    title
    type
    content
    likes
    status
    created_at
    owner {
      id
      username
      profile_pic
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
`;

