export const userTypeDefs = `
  type LoginUser {
    username: String!
    password: String!   
  }
  type User {
    id: Int!
    email: String!
    username: String!
    status: STATUS
    role: Role
    dob: String
    country: String
    about: String
    new_user: Boolean
    profile_pic: String
    token: String
    verified: Boolean
    background_pic: String
    created_at: String
    posts: [Post]
    chatrooms: [UserChatroom]
    ownedCommunities: [Community]
    communities: [UserCommunity]
    comments: [Comment]
    savedposts: [SavedPost]
    reactedposts: [Postlikedislike]
    settings: UserPreferences
  }
  enum STATUS {
    ACTIVE
    INACTIVE
  }
  input LoginUserInput {
    username: String!
    password: String!
  }
  input MagicLinkLoginInput {
    email: String!
  }
  input InsertUserInput {
    id: Int
    email: String
    username: String
    dob: String
    country: String
    about: String
    status: String
    password: String   
    new_user: Boolean
    role: Int
    verified: Boolean
    profile_pic: String
    background_pic: String
  }
  input UsersfilterInput {
    id: Int
    email: String
    username: String
    dob: String
    role: Int
    country: String
    status: String
    new_user: Boolean
    profile_pic: String
    background_pic: String
    created_at: String
  }
  input RemoveUserInput {
    id: Int!
  }
`;
