import { gql } from "@apollo/client";

export const UPDATEPOST = gql`
  mutation UpdatePost($data: UpsertPostInput) {
    updatePost(data: $data) {
      id
    }
  }
`;

export const REMOVEUSERCOMMUNITY = gql`
  mutation RemoveUserCommunity($data: RemoveUserCommunityInput) {
    removeUserCommunity(data: $data) {
      id
    }
  }
`;

export const POSTLIKEDISLIKE = gql`
  mutation UpsertPostLikeDislike($data: UpsertPostLikeDislikeInput) {
    upsertPostLikeDislike(data: $data) {
      id
    }
  }
`;

export const UPSERTSAVEDPOST = gql`
  mutation UpsertSavedPost($data: InsertSavedPostInput) {
    upsertSavedPost(data: $data) {
      id
    }
  }
`;

export const INSERTUSERCOMMUNITY = gql`
  mutation InsertUserCommunity($data: InsertUserCommunityInput) {
    insertUserCommunity(data: $data) {
      id
    }
  }
`;

export const GETUSERALLREACTIONS = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      id
      reactedposts {
        reaction
        post_id {
          id
        }
      }
      communities {
        community_id {
          id
        }
      }
      savedposts {
        saved
        pinned
        post_id {
          id
        }
      }
    }
  }
`;
