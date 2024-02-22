export const messageTypeDefs = `
  type Message {
    id: Int!
    user_id: User!
    message: String!
    room_id: Chatroom!
    created_at: String
  }
  input InsertMessageInput {
    user_id: Int!
    message: String!
    room_id: String!
  }
  input MessagesfilterInput {
    id: Int
    user_id: Int
    room_id: String
  }
  input RemoveMessageInput {
    id: Int!
  }
`;
