export const postTypeDefs = `
  type Post {
    id: Int!
    title: String!
    owner: User!
    community_id: Community
    content: String
    type: TYPE!
    likes: Int
    status: STATUS!
    privacy: PRIVACY!
    created_at: String
    tags: [PostTags]
    comments: [Comment]
  }
  enum STATUS {
    ACTIVE
    INACTIVE
  }
  enum PRIVACY {
    PUBLIC
    PRIVATE 
  }
  enum TYPE {
    BLOG
    IMAGE
    POLL
    LINK
  }
  input UpsertPostInput {
    title: String!
    owner: Int!
    community_id: Int
    content: String
    type: String!
    status: String
    privacy: String
    tag: [String]
  }
  input RemovePostInput {
    id: Int!
  }
  input PostfilterInput {
    id: Int
    owner: Int
    community_id: Int
    tag: String
    type: String
    status: String
    privacy: String
    likes: Int
  }
  input SortInput { 
    column: String
    order: String
    nulls: String
  }
`;
