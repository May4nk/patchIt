export const notificationTypeDefs = `
  enum NOTIFICATIONTYPE {
    CHAT
    FRIEND
  }

  enum STATUS {
    ACCEPT
    REJECT
    PENDING
  }

  type Notification {
    id: String
    type: NOTIFICATIONTYPE
    message: String
    status: STATUS
    touser: User
    fromuser: User
    created_at: String
  }

  input InsertNotificationInput {
    id: String
    type: NOTIFICATIONTYPE
    message: String
    status: STATUS
    touser: String
    fromuser: String
  }

  input NotificationfilterInput {
    id: String
    type: NOTIFICATIONTYPE
    message: String
    status: STATUS
    touser: String
    fromuser: String
    created_at: String
  }

  input RemoveNotificationInput {
    touser: String!
    fromuser: String!
    type: NOTIFICATIONTYPE
  }
`;
