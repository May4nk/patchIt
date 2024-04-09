import { gql } from "@apollo/client";

export const GETCOMMUNITY = gql`
query Community($communityname: String!) {
  community(communityname: $communityname) {
    id
    description
    about
    communityname
    background_pic
    created_at
    privacy
    profile_pic
    status
    theme
    owner {
      id
      username      
    }
    posts {
      id
      title
      type
      owner {
        id
        profile_pic
        username
      }
      content
      created_at
      likes
      status
      comments {
        id
      }
    }
    users {
      id
      user_id {
        id
      }
    }
  }
}
`;
