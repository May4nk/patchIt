export const commentTypeDefs = `
  type Comment {
    id: Int!
    likes: Int
    post_id: Post
    user_id: User
    status: String
    comment: String
    parent_id: Comment
    created_at: String
  }

  input UpsertCommentInput {
    id: Int
    parent_id: Int
    likes: Int
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
    likes: Int
  }

  input RemoveCommentInput {
    id: Int!
  }
`;
