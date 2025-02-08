import { gql } from "@apollo/client";
import { CORE_POST_FIELDS } from "../../utils/main/fragments";

export const USER_ID_USERNAME = gql`
  fragment userIdNameFields on User {
    id
    username
  }
`;

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    ...userIdNameFields
    status
    profile_pic
  }
  ${USER_ID_USERNAME}
`;

export const USER_BASIC_FIELDS = gql`
  fragment userBasicFields on User {
    ...CoreUserFields
    email
    about
    privacy
  }
  ${CORE_USER_FIELDS}
`;

const CORE_FIELDS = gql`
  fragment CoreUserInfoFields on User {
    ...userBasicFields
    dob
    created_at
    country
    background_pic
    social_links
    new_user
    role {
      id
      role
    }
    ownedCommunities {
      id
      name
      owner {
        id
      }
    }
    comments {
      id
      text
      created_at
      post_id {
        id
        title
        community_id {
          id
          name
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
        text
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
        ...userIdNameFields
      }
      follower {
        ...userIdNameFields
      }
    }
    settings {
      nsfw
      allowppltofollow
    }
  }
  ${USER_BASIC_FIELDS}
  ${CORE_POST_FIELDS}
  ${USER_ID_USERNAME}
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
