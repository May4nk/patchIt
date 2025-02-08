export const communityTypeDefs = `
  enum STATUS {
    ACTIVE
    INACTIVE
  }

  enum PRIVACY {
    PUBLIC
    PRIVATE
  }
  
  type Community {
    id: String!
    name: String!
    display_name: String
    owner: User!
    description: String
    about: String
    status: STATUS
    theme: String
    category: Category
    privacy: PRIVACY
    background_pic: String   
    profile_pic: String
    social_links: String
    created_at: String
    users: [UserCommunity]
    posts: [Post]
    settings: CommunityPreferences
  }                                   

  input UpsertCommunityInput {
    id: String
    name: String!
    display_name: String
    owner: String
    description: String
    status: STATUS
    about: String
    category: String
    social_links: String
    theme: String
    privacy: PRIVACY
    background_pic: String   
    profile_pic: String
  }

  input CommunitiesfilterInput {
    id: String
    name: String
    display_name: String
    owner: String
    status: STATUS
    privacy: PRIVACY
    theme: String
    category: String
  }
    
  input RemoveCommunityInput {
    id: String!
  }
`;
