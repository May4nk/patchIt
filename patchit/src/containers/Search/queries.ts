import { gql } from "@apollo/client";

export const GETUSERS = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      id
      email
      username
      about
      profile_pic
      status
      posts {
        id
      }
    }
  }
`;

export const GETCOMMUNITIES = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      id
      communityname
      profile_pic
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
`;

export const GETALLCOMMENTS = gql`
  query ListComments($filter: CommentfilterInput) {
    listComments(filter: $filter) {
      id
      comment
      created_at
      user_id {
        username
        profile_pic
      }
      parent_id {
        comment
        user_id {
          username
        }
      }
      post_id {
        id
        title
        community_id {
          communityname
          profile_pic
        }
        created_at
      }
    }
  }
`;

export const GETCOMMUNITYALLACTIONS = gql`
  query Community($communityname: String!) {
    community(communityname: $communityname) {
      users {
        user_id {
          id
          email
          username
          about
          profile_pic
          status
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
          id
          communityname
          profile_pic
        }
        comments {
          id
          comment
          created_at
          user_id {
            username
            profile_pic
          }
          parent_id {
            comment
            user_id {
              username
            }
          }
          post_id {
            id
            title
            community_id {
              communityname
              profile_pic
            }
            created_at
          }
        }
      }
    }
  }
`;
