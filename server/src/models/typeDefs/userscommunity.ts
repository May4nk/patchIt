export const usercommunityTypeDefs = `
  type UserCommunity {
    id: String!
    community_id: Community
    user_id: User
    created_at: String
  }

  input InsertUserCommunityInput {
    community_id: String!
    user_id: String!
  }

  input UserCommunityfilterInput {
    id: String
    community_id: String
    user_id: String
    created_at: String
  }

  input RemoveUserCommunityInput {
    community_id: String
    user_id: String
  }
`;
