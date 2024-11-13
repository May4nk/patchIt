import { gql } from "@apollo/client";

export const UPSERTCOMMENT = gql`
  mutation UpsertComment($data: UpsertCommentInput) {
    upsertComment(data: $data) {
      id
    }
  }
`;

export const INSERTUSERCOMMENTLIKE = gql`
  mutation InsertUserCommentLike($data: InsertUserCommentInput) {
    insertUserCommentLike(data: $data) {
      id
    }
  }
`;

export const LISTUSERCOMMENTLIKES = gql`
  query ListUserCommentLikes($filter: UserCommentfilterInput) {
    listUserCommentLikes(filter: $filter) {
      id
      user_id {
        id
      }
      comment_id {
        id
      }
    }
  }
`;
