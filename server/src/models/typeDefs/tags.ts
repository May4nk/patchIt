export const tagTypeDefs = `
  type Tag {
    id: String!
    name: String!
    created_at: String
  }

  input UpsertTagInput {
    id: String
    name: String!
  }

  input TagsfilterInput {
    id: String
    name: String
  }
    
  input RemoveTagInput {
    id: String!
  }
`;
