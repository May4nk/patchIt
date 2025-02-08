import { gql } from "@apollo/client";
import { CORE_USER_FIELDS } from "../../containers/queries/user";

const CORE_ROOM_FIELDS = gql`
  fragment CoreRoomFields on Chatroom {
    id
    roomName
    owner {
      id
    }
  }
`;

//queries
export const GETALLMSGS = gql`
  query ListMessages($filter: MessagesfilterInput) {
    listMessages(filter: $filter) {
      id
      text
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

export const CHECKROOMEXISTS = gql`
  mutation CheckRoomExists($data: CheckRoomExists) {
    checkRoomExists(data: $data)
  }
`;

export const GETCHATROOM = gql`
  query Chatroom($chatroomId: String!) {
    chatroom(chatroomId: $chatroomId) {
      ...CoreRoomFields
      roomUsers {
        ...CoreUserFields
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
  ${CORE_ROOM_FIELDS}
  ${CORE_USER_FIELDS}
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
        text
      }
    }
  }
  ${CORE_ROOM_FIELDS}
  ${CORE_USER_FIELDS}
`;

export const GETALLUSERS = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      ...CoreUserFields
    }
  }
  ${CORE_USER_FIELDS}
`;

//mutations
export const CREATECHATROOM = gql`
  mutation UpsertChatroom($data: InsertChatroomInput) {
    upsertChatroom(data: $data) {
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
        text
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
  subscription UserChatroom($userId: String!) {
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
        text
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
      text
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
