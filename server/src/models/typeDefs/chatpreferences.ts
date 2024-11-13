export const chatpreferencesTypeDefs = `
  type ChatPreferences {
    id: Int!
    owner: User!
    room: Chatroom!
    about: String
    group_profile: String
    blocked: String
    allowedmedia: String
    chatgrouptheme: String
    admin: User
    co_admin: User
    acceptor: User
    operator: User
  }

  input InsertChatPreferencesInput {
    owner: Int!
    room: String!
    about: String
    group_profile: String
    blocked: String
    allowedmedia: String
    chatgrouptheme: String
    admin: String
    co_admin: String
    acceptor: String
    operator: String
  }

  input ChatPreferencesfilterInput {
    owner: Int
    room: String
    blocked: String
    allowedmedia: String
    chatgrouptheme: String
    admin: String
    co_admin: String
    acceptor: String
    operator: String
  }
  
  input RemoveChatPreferencesInput {
    id: Int
  }
`;
