export const commentTypeDefs = `
  enum STATUS {
    ACTIVE
    DELETED
  }

  type Comment {
    id: String!
    likes: Int
    post_id: Post
    user_id: User
    status: STATUS
    text: String
    parent_id: Comment
    created_at: String
  }

  input UpsertCommentInput {
    id: String
    parent_id: String
    likes: Int
    user_id: String
    post_id: String
    text: String
    status: STATUS
  }

  input CommentfilterInput {
    id: String
    parent_id: String
    user_id: String
    post_id: String
    status: STATUS
    likes: Int
  }

  input RemoveCommentInput {
    id: String!
  }
`;
