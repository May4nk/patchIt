export const postlikedislikeTypeDefs = `
  enum REACTION {
    TRUE
    NONE
    FALSE    
  }

  type Postlikedislike {
    id: String!
    post_id: Post!
    reaction: REACTION
    user_id: User!
    created_at: String
  }

  input UpsertPostLikeDislikeInput {
    id: String
    post_id: String!
    user_id: String!
    reaction: REACTION!
  }

  input PostlikedislikefilterInput {
    id: String
    post_id: String
    user_id: String
    reaction: REACTION
  }
        
  input RemovePostLikeDislikeInput {
    id: String!
  }
`;
