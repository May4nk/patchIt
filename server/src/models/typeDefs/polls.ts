export const pollTypeDefs = `
  type Poll { 
    id: Int!
    user_id: User!
    pollvalue: String!
    post_id: Post!
  }
  input InsertPollInput {
    user_id: Int!
    pollvalue: String!
    post_id: Int!
  }
  input PollfilterInput {
    user_id: Int
    pollvalue: String
    post_id: Int
  }
  input RemovePollInput {
    user_id: Int
    pollvalue: String
    post_id: Int
  }
`;
