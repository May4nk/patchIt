export const userchatroomTypeDefs = `
  enum STATUS {
    ACTIVE
    INACTIVE
  }

  type UserChatroom {
    id: String!
    room_id: Chatroom
    user_id: User
    status: STATUS
    created_at: String
    users: [User]
    lastMessage: Message
  }

  input InsertUserChatroomInput {
    room_id: String!
    user_id: String!
  }

  input UserChatroomfilterInput {
    room_id: [String]
    user_id: String
    status: STATUS
  }
    
  input RemoveUserChatroomInput {
    id: String!
  }
`;
