export const tokenTypeDefs = `
  type Token {
    id: Int
    user_id: User
    token: String
    created_at: String
  }

  input InsertTokenInput {
    user_id: Int!
    token: String!
  }

  input TokenfilterInput {
    id: Int
    user_id: Int
    token: String
    created_at: Int
  } 

  input RemoveTokenInput {
    id: Int!
  }
`;
