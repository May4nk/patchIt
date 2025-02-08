import { gql } from "@apollo/client";

export const CORE_POST_FIELDS = gql`
  fragment CorePostFields on Post {
    id
    likes
    title
    type
    status
    content
    created_at
    owner {
      id
      username
      profile_pic
      status
    }
    community_id {
      id
      name
      profile_pic
      owner {
        id
      }
    }
    comments {
      id
    }
  }
`;
