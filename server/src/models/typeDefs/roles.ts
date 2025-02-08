export const roleTypeDefs = `
  type Role {
    id: String!
    role: String!
    access: String
    role_id: Int!
    created_at: String
  }

  input UpsertRoleInput {
    id: String
    role: String!
    role_id: Int!
    access: String
  }

  input RolesfilterInput {
    id: String
    role_id: Int
    role: String
  }
    
  input RemoveRoleInput {
    role: String!
  }
`;
