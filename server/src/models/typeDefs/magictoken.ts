export const magictokenTypeDefs = `
  type MagicToken {
    id: Int
    email: User
    token: String
    expires_at: String
    created_at: String
  }

  input InsertMagicTokenInput {
    email: String!
    token: String!
    expires_at: String!
  }

  input MagicTokenfilterInput {
    id: Int
    email: String
    token: String
    expires_at: String
    created_at: String
  } 

  input RemoveMagicTokenInput {
    id: Int!
  }
`;
