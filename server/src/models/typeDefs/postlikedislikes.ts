export const postlikedislikeTypeDefs = `
  type Postlikedislike {
    id: Int!
    post_id: Post!
    reaction: Int
    user_id: User!
    created_at: String
  }
  input UpsertPostLikeDislikeInput {
    id: Int
    post_id: Int!
    user_id: Int!
    reaction: Int!
  }
  input PostlikedislikefilterInput {
    id: Int
    post_id: Int
    user_id: Int
    reaction: Int
  }
  input RemovePostLikeDislikeInput {
    id: Int!
  }
`;
