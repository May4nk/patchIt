export const commentTypeDefs = `
  type Comment {
    id: Int!
    user_id: User
    post_id: Post
    parent_id: Comment
    comment: String
    status: String
    created_at: String
  }          
  input UpsertCommentInput {
    id: Int
    parent_id: Int
    user_id: Int
    post_id: Int
    comment: String
    status: String
  }
  input CommentfilterInput {
    id: Int
    parent_id: Int
    user_id: Int
    post_id: Int
    status: String
  }
  input RemoveCommentInput {
    id: Int!
  }
`;
