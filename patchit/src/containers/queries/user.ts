import { gql } from "@apollo/client";

const CORE_FIELDS = gql`
  fragment CoreFields on User {
    id
    email
    username
    status
    dob
    created_at
    country
    background_pic
    about
    profile_pic
    role {
      id
      role
    }
    ownedCommunities {
      id
      communityname
      owner {
        id
      }
    }
    comments {
      id
      comment
      status
      post_id {
        id
        title
        community_id {
          communityname
        }
      }
      parent_id {
        id
        comment
        user_id {
          username
          profile_pic
        }
        status
      }
    }
    posts {
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

export const GETUSER = gql`
  query User($username: String!) {
    user(username: $username) {
      ...CoreFields
    }
  }
  ${CORE_FIELDS}
`;

export const GETSIGNEDUPUSER = gql`
  query User($username: String!) {
    user(username: $username) {
      ...CoreFields
      savedposts {
        saved
        pinned
        post_id {
          id
          title
          type
          content
          community_id {
            id
            communityname
            profile_pic
          }
          likes
          status
        }
      }
      reactedposts {
        reaction
        post_id {
          id
          title
          type
          content
          likes
          status
          community_id {
            id
            communityname
            profile_pic
          }
        }
      }
    }
  }
  ${CORE_FIELDS}
`;
