import { gql } from "@apollo/client";
import { CORE_POST_FIELDS } from "../../utils/main/fragments";

const CORE_FIELDS = gql`
  fragment CoreUserInfoFields on User {
    id
    email
    username
    privacy
    dob
    created_at
    country
    background_pic
    about
    status
    profile_pic
    social_links
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
      created_at
      post_id {
        id
        title
        community_id {
          communityname
          profile_pic
        }
        created_at
      }
      user_id {
        username
        profile_pic
        status
      }
      parent_id {
        comment
        user_id {
          username
          status
        }
        created_at
      }
    }
    posts {
      ...CorePostFields
    }
    followers {
      id
      following {
        id
        username
      }
      follower {
        id
        username
      }
    }
    settings {
      nsfw
      allowppltofollow
    }
  }
  ${CORE_POST_FIELDS}
`;

export const GETUSER = gql`
  query User($username: String!) {
    user(username: $username) {
      ...CoreUserInfoFields
    }
  }
  ${CORE_FIELDS}
`;

export const GETSIGNEDUPUSER = gql`
  query User($username: String!) {
    user(username: $username) {
      ...CoreUserInfoFields
      savedposts {
        saved
        pinned
        post_id {
          ...CorePostFields
        }
      }
      reactedposts {
        reaction
        post_id {
          ...CorePostFields
        }
      }
    }
  }
  ${CORE_FIELDS},
  ${CORE_POST_FIELDS}
`;
