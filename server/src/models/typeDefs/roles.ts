export const roleTypeDefs = `
  type Role {
    id: Int
    role: String!
    access: String
    created_at: String
  }
  input UpsertRoleInput {
    id: Int
    role: String!
    access: String
  }
  input RolesfilterInput {
    id: Int
    role: String
  }
  input RemoveRoleInput {
    role: String!
  }
`;
