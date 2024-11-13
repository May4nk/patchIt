export const communityTypeDefs = `
  type Community {
    id: Int
    communityname: String!
    owner: User!
    description: String
    about: String
    status: String
    theme: String
    category: Category
    privacy: String
    background_pic: String   
    profile_pic: String
    social_links: String
    created_at: String
    users: [UserCommunity]
    posts: [Post]
    settings: CommunityPreferences
  }                                         
  input UpsertCommunityInput {
    id: Int
    communityname: String!
    owner: Int
    description: String
    status: String
    about: String
    category: String
    social_links: String
    theme: String
    privacy: String
    background_pic: String   
    profile_pic: String
  }
  input CommunitiesfilterInput {
    id: Int
    communityname: String
    owner: Int
    status: String
    privacy: String
    theme: String
    category: String
  }
  input RemoveCommunityInput {
    id: Int!
  }
`;
