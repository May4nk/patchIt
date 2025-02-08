import { gql } from "@apollo/client";
import { USER_BASIC_FIELDS } from "../queries/user";
import { COMMUNITY_BASIC_FIELDS } from "../queries/community";

export const GETUSERS = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      ...userBasicFields
      posts {
        id
      }
    }
  }
  ${USER_BASIC_FIELDS}
`;

export const GETCOMMUNITIES = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      ...communityBasicFields
      privacy
      about
      status
      theme
      users {
        id
      }
      posts {
        id
      }
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const GETALLCOMMENTS = gql`
  query ListComments($filter: CommentfilterInput) {
    listComments(filter: $filter) {
      id
      text
      created_at
      user_id {
        username
        profile_pic
      }
      parent_id {
        text
        user_id {
          username
        }
      }
      post_id {
        id
        title
        community_id {
          ...communityBasicFields
        }
        created_at
      }
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const GETCOMMUNITYALLACTIONS = gql`
  query Community($communityname: String!) {
    community(communityname: $communityname) {
      users {
        user_id {
          ...userBasicFields
          posts {
            id
          }
        }
      }
      posts {
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
          ...communityBasicFields
        }
        comments {
          id
          text
          created_at
          user_id {
            username
            profile_pic
          }
          parent_id {
            text
            user_id {
              username
            }
          }
          post_id {
            id
            title
            community_id {
              ...communityBasicFields
            }
            created_at
          }
        }
      }
    }
  }
  ${USER_BASIC_FIELDS}
  ${COMMUNITY_BASIC_FIELDS}
`;
