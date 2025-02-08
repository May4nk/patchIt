export const magictokenTypeDefs = `
  type MagicToken {
    id: String
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
    id: String
    email: String
    token: String
    expires_at: String
    created_at: String
  } 

  input RemoveMagicTokenInput {
    id: String!
  }
`;
