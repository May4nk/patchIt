export const userTypeDefs = `
  enum STATUS {
    ACTIVE
    INACTIVE
  }

  enum PRIVACY {
    PUBLIC
    PRIVATE
  }

  type LoginUser {
    email: String
    username: String
    password: String!
  }

  type User {
    id: String!
    email: String!
    username: String!
    status: STATUS
    role: Role
    dob: String
    country: String
    about: String
    privacy: PRIVACY
    new_user: Boolean
    profile_pic: String
    token: String
    verified: Boolean
    social_links: String
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
    followers: [UserFollowing]
  }

  input LoginUserInput {
    email: String
    username: String
    password: String!
  }

  input MagicLinkLoginInput {
    email: String!
    password: String!
    message: String!
  }
    
  input InsertUserInput {
    id: String
    email: String
    username: String
    dob: String
    country: String
    about: String
    status: STATUS
    privacy: PRIVACY
    password: String
    new_user: Boolean
    social_links: String
    role: Int
    verified: Boolean
    profile_pic: String
    background_pic: String
  }

  input UsersfilterInput {
    id: String
    email: String
    username: String
    dob: String
    role: Int
    country: String
    status: STATUS
    privacy: PRIVACY
    new_user: Boolean
    profile_pic: String
    background_pic: String
    created_at: String
  }

  input RemoveUserInput {
    id: String!
  }

  input ChangePasswordInput {
    id: String!
    password: String!
    newPassword: String!
  }

  input RequestForgetPasswordInput {
    email: String!    
    message: String!
  }

  input ForgetPasswordInput {
    token: String!    
    password: String!
    cpassword: String!
  }
`;
