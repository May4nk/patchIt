export const usercommentsTypeDefs = `
  type UserComment {
    id: String!
    comment_id: Comment!
    user_id: User!
    created_at: String
  }

  input InsertUserCommentInput {
    id: String
    comment_id: String!
    user_id: String!
  }

  input UserCommentfilterInput {
    id: String
    post_id: String
    user_id: String
  }

  input RemoveUserCommentInput {
    id: String!
  }
`;
