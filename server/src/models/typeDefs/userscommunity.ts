export const usercommunityTypeDefs = `
  type UserCommunity {
    id: Int!
    community_id: Community
    user_id: User
    created_at: String
  }
  input InsertUserCommunityInput {
    community_id: Int!
    user_id: Int!
  }
  input UserCommunityfilterInput {
    id: Int
    community_id: Int
    user_id: Int
    created_at: String
  }
  input RemoveUserCommunityInput {
    community_id: Int
    user_id: Int
  }
`;
