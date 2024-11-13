export const notificationTypeDefs = `
  enum NOTIFICATIONTYPE {
    CHAT
    FRIEND
  }

  type Notification {
    id: Int
    type: NOTIFICATIONTYPE
    message: String
    status: String
    touser: User
    fromuser: User
  }

  input InsertNotificationInput {
    id: Int
    type: NOTIFICATIONTYPE
    message: String
    status: String
    touser: Int
    fromuser: Int
  }

  input NotificationfilterInput {
    id: Int
    type: NOTIFICATIONTYPE
    message: String
    status: String
    touser: Int
    fromuser: Int
  }

  input RemoveNotificationInput {
    touser: Int!
    fromuser: Int!
    type: NOTIFICATIONTYPE
  }
`;
