import { gql } from "@apollo/client";

export const UPSERTCOMMENT = gql`
  mutation UpsertComment($data: UpsertCommentInput) {
    upsertComment(data: $data) {
      id
    }
  }
`;

