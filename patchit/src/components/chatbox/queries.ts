import { gql } from "@apollo/client";

const CORE_ROOM_FIELDS = gql`
  fragment CoreRoomFields on Chatroom {
    id
    room_code
    roomName
    owner {
      id
    }
  }
`;

const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id
    status
    username
    profile_pic
  }
`;

//queries
export const GETALLMSGS = gql`
  query ListMessages($filter: MessagesfilterInput) {
    listMessages(filter: $filter) {
      id
      message
      media
      created_at
      room_id {
        ...CoreRoomFields
      }
      user_id {
        ...CoreUserFields
      }
    }
  }
  ${CORE_ROOM_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const GETCHATROOM = gql`
  query Chatroom($chatroomId: String!) {
    chatroom(chatroomId: $chatroomId) {
      id
      roomName
      room_code
      roomUsers {
        id
        username
        profile_pic
        status
      }
      owner {
        id
      }
      chatPreferences {
        about
        group_profile
        allowedmedia
        chatgrouptheme
        blocked
        admin {
          username
        }
        co_admin {
          username
        }
        operator {
          username
        }
        acceptor {
          username
        }
      }
    }
  }
`;

export const GETUSERCHATROOMS = gql`
  query ListUserChatrooms(
    $sort: [SortInput]
    $limit: Int
    $filter: UserChatroomfilterInput
  ) {
    listUserChatrooms(sort: $sort, limit: $limit, filter: $filter) {
      id
      room_id {
        ...CoreRoomFields
      }
      user_id {
        ...CoreUserFields
      }
      users {
        ...CoreUserFields
      }
      lastMessage {
        message
      }
    }
  }
  ${CORE_ROOM_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const GETALLUSERS = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      id
      username
      profile_pic
    }
  }
`;

//mutations
export const CREATECHATROOM = gql`
  mutation InsertChatroom($data: InsertChatroomInput) {
    insertChatroom(data: $data) {
      ...CoreRoomFields
    }
  }
  ${CORE_ROOM_FIELDS}
`;

export const INSERTUSERCHATROOM = gql`
  mutation InsertUserChatroom($data: [InsertUserChatroomInput!]!) {
    insertUserChatroom(data: $data) {
      id
      room_id {
        ...CoreRoomFields
      }
      user_id {
        ...CoreUserFields
      }
      users {
        ...CoreUserFields
      }
      lastMessage {
        message
      }
    }
  }
  ${CORE_ROOM_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const INSERTMSG = gql`
  mutation NewMessage($data: InsertMessageInput) {
    insertMessage(data: $data) {
      id
    }
  }
`;

export const DELETECHATROOM = gql`
  mutation DeleteChatroom($data: InsertChatroomInput) {
    softDeleteChatroom(data: $data) {
      ...CoreRoomFields
    }
  }
  ${CORE_ROOM_FIELDS}
`;

export const UPSERTCHATROOMPREFERENCE = gql`
  mutation UpsertChatPreference($data: InsertChatPreferencesInput) {
    upsertChatPreference(data: $data) {
      id
    }
  }
`;

//subscriptions
export const GETALLCHATER = gql`
  subscription NewChatroom {
    newChatroom {
      ...CoreRoomFields
    }
  }
  ${CORE_ROOM_FIELDS}
`;

export const SUBSCRIBETOUSERCHATROOMS = gql`
  subscription UserChatroom($userId: Int!) {
    newUserChatroom(userId: $userId) {
      id
      room_id {
        ...CoreRoomFields
      }
      user_id {
        ...CoreUserFields
      }
      users {
        ...CoreUserFields
      }
      lastMessage {
        message
      }
    }
  }
  ${CORE_ROOM_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const SUBSCRIBETONEWMSG = gql`
  subscription NewMessage {
    newMessage {
      id
      message
      media
      created_at
      room_id {
        ...CoreRoomFields
      }
      user_id {
        ...CoreUserFields
      }
    }
  }
  ${CORE_ROOM_FIELDS}
  ${CORE_USER_FIELDS}
`;
