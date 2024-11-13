export const userfollowingTypeDefs = `
  type UserFollowing {
    id: Int!
    follower: User
    following: User
    created_at: String
  }                                         
  input InsertUserFollowingInput {
    follower: Int!
    following: Int!
  }
  input UserFollowingfilterInput {
    id: Int
    follower: Int
    following: Int
    created_at: String
  }
  input RemoveUserFollowingInput {
    id: Int
    follower: Int
    following: Int
  }
`;
