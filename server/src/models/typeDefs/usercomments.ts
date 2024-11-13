export const usercommentsTypeDefs = `
  type UserComment {
    id: Int!
    comment_id: Comment!
    user_id: User!
    created_at: String
  }
  input InsertUserCommentInput {
    id: Int
    comment_id: Int!
    user_id: Int!
  }
  input UserCommentfilterInput {
    id: Int
    post_id: Int
    user_id: Int
  }
  input RemoveUserCommentInput {
    id: Int!
  }
`;
