export const pollTypeDefs = `
  type Poll { 
    id: String!
    user_id: User!
    pollvalue: String!
    post_id: Post!
  }

  input InsertPollInput {
    user_id: String!
    pollvalue: String!
    post_id: String!
  }

  input PollfilterInput {
    user_id: String
    pollvalue: String
    post_id: String
  }

  input RemovePollInput {
    user_id: String
    pollvalue: String
    post_id: String
  }
`;
