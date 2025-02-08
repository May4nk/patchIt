export const messageTypeDefs = `
  enum STATUS {
    ACTIVE
    DELETED
  }

  type Message {
    id: String!
    user_id: User!
    text: String!
    room_id: Chatroom!
    media: Boolean
    status: STATUS
    created_at: String
  }

  input InsertMessageInput {
    id: String
    user_id: String!
    text: String!
    room_id: String!
    status: STATUS
    media: Boolean
  }

  input MessagesfilterInput {
    id: String
    user_id: String
    room_id: String
    status: STATUS
    media: Boolean
  }

  input RemoveMessageInput {
    id: String!
  }
`;
