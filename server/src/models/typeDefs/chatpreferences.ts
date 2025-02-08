export const chatpreferencesTypeDefs = `
  enum CHATMEDIA {
    ALL
    IMAGES
    VIDEOS
  }

  type ChatPreferences {
    id: String!
    owner: User!
    room: Chatroom!
    about: String
    group_profile: String
    blocked: String
    allowedmedia: CHATMEDIA
    chatgrouptheme: String
    admin: User
    co_admin: User
    acceptor: User
    operator: User
  }

  input InsertChatPreferencesInput {
    owner: String!
    room: String!
    about: String
    group_profile: String
    blocked: String
    allowedmedia: CHATMEDIA
    chatgrouptheme: String
    admin: String
    co_admin: String
    acceptor: String
    operator: String
  }

  input ChatPreferencesfilterInput {
    owner: String
    room: String
    blocked: String
    allowedmedia: CHATMEDIA
    chatgrouptheme: String
    admin: String
    co_admin: String
    acceptor: String
    operator: String
  }
  
  input RemoveChatPreferencesInput {
    id: String
  }
`;
