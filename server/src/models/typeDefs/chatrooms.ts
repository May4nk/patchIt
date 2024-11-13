export const chatroomTypeDefs = `
  enum STATUS {
    ACTIVE,
    INACTIVE
  }

  type Chatroom {
    id: Int!
    room_code: String!
    roomName: String
    owner: User!
    status: STATUS
    created_at: String
    roomUsers: [User]
    chatPreferences: ChatPreferences
  }

  input InsertChatroomInput {
    room_code: String!
    owner: Int!
    roomName: String
    status: STATUS
  }

  input ChatroomsfilterInput {
    id: Int
    room_code: String
    roomName: String
    owner: Int
    status: STATUS
  }
    
  input RemoveChatroomInput {
    id: Int
  }
`;
