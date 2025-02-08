export const userfollowingTypeDefs = `
  type UserFollowing {
    id: String!
    follower: User
    following: User
    created_at: String
  }

  input InsertUserFollowingInput {
    follower: String!
    following: String!
  }

  input UserFollowingfilterInput {
    id: String
    follower: String
    following: String
    created_at: String
  }

  input RemoveUserFollowingInput {
    id: String
    follower: String
    following: String
  }
`;
