export const tagTypeDefs = `
  type Tag {
    id: Int!
    name: String!
  }
  input UpsertTagInput {
    id: Int
    name: String!
  }
  input TagsfilterInput {
    id: Int
    name: String
  }
  input RemoveTagInput {
    id: Int!
  }
`;
