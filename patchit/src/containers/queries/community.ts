import { gql } from "@apollo/client";

const COMMUNITY_POST_FIELDS = gql`
  fragment communityPostFields on Post {
    id
    title
    type
    owner {
      id
      username
      status
      profile_pic
    }
    content
    created_at
    likes
    status
    comments {
      id
    }
  }
`;

const COMMUNITY_FIELDS = gql`
  fragment communityFields on Community {
    id
    description
    about
    communityname
    background_pic
    created_at
    privacy
    profile_pic
    theme
    status
    social_links
    owner {
      id
      username
    }
  }
`;

export const GETCOMMUNITY = gql`
  query Community($communityname: String!) {
    community(communityname: $communityname) {
      ...communityFields
      posts {
        ...communityPostFields
      }
      users {
        id
        user_id {
          id
        }
      }
      settings {
        nsfw
        allowppltofollow
      }
    }
  }
  ${COMMUNITY_POST_FIELDS},
  ${COMMUNITY_FIELDS}
`;
