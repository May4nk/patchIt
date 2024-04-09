export const userchatroomTypeDefs = `
  type UserChatroom {
    id: Int!
    room_id: Chatroom
    user_id: User
    users: [User]
    lastMessage: Message
    status: String
    created_at: String
  }
  input InsertUserChatroomInput {
    room_id: String!
    user_id: Int!
  }
  input UserChatroomfilterInput {
    room_id: String
    user_id: Int
    status: String
  }
  input RemoveUserChatroomInput {
    id: Int!    
  }
`;
