export const chatroomTypeDefs = `
  type Chatroom {
    id: Int!
    room_code: String!
    status: String
    created_at: String
  }
  input InsertChatroomInput {
    room_code: String!
  }
  input ChatroomsfilterInput {
    id: Int
    room_code: String
    status: String
  }
  input RemoveChatroomInput {
    id: Int
  }
`;
