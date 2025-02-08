export const savedpostTypeDefs = `
  type SavedPost {
    id: String!
    user_id: User!
    post_id: Post!
    saved: Boolean
    pinned: Boolean
  }

  input InsertSavedPostInput {    
    user_id: String!
    post_id: String!
    saved: Boolean
    pinned: Boolean
  }
    
  input SavedPostfilterInput {
    id: String
    user_id: String
    post_id: String
    saved: Boolean
    pinned: Boolean
  }

  input RemoveSavedPostInput {
    user_id: String!
    post_id: String!
    saved: Boolean
    pinned: Boolean
  }
`;
