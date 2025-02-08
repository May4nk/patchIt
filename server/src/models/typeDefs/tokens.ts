export const tokenTypeDefs = `
  enum STATUS {
    ACTIVE
    DELETED
  }
    
  type Token {
    id: String
    user_id: User
    token: String
    status: STATUS
    created_at: String
  }

  input InsertTokenInput {
    user_id: String!
    token: String!
    status: STATUS
  }

  input TokenfilterInput {
    id: String
    user_id: String
    token: String
    status: STATUS
    created_at: String
  } 

  input RemoveTokenInput {
    id: String!
  }
`;
