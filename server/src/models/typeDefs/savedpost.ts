export const savedpostTypeDefs = `
  type SavedPost {
    id: Int!
    user_id: User
    post_id: Post
    saved: Boolean
    pinned: Boolean
  }
  input InsertSavedPostInput {    
    user_id: Int!
    post_id: Int!
    saved: Boolean
    pinned: Boolean
  }
  input SavedPostfilterInput {
    id: Int
    user_id: Int
    post_id: Int
    saved: Boolean
    pinned: Boolean
  }
  input RemoveSavedPostInput {
    user_id: Int!
    post_id: Int!
    saved: Boolean
    pinned: Boolean
  }
`;
