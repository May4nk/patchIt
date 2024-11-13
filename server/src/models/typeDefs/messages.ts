export const messageTypeDefs = `
  type Message {
    id: Int!
    user_id: User!
    message: String!
    room_id: Chatroom!
    media: Boolean
    created_at: String
  }
  input InsertMessageInput {
    id: Int
    user_id: Int!
    message: String!
    room_id: String!
    media: Boolean
  }
  input MessagesfilterInput {
    id: Int
    user_id: Int
    room_id: String
    media: Boolean
  }
  input RemoveMessageInput {
    id: Int!
  }
`;
