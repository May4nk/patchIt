export const chatroomTypeDefs = `
  enum STATUS {
    ACTIVE,
    INACTIVE
  }

  type Chatroom {
    id: String!
    roomName: String
    owner: User!
    status: STATUS
    created_at: String
    roomUsers: [User]
    chatPreferences: ChatPreferences
  }

  input InsertChatroomInput {    
    owner: String!
    roomName: String
    status: STATUS
  }

  input ChatroomsfilterInput {
    id: String    
    roomName: [String]
    owner: String
    status: STATUS
  }

  input CheckRoomExists {
    roomName: String
  }
    
  input RemoveChatroomInput {
    id: String
  }
`;
