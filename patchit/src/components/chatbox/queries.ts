import { gql } from "@apollo/client";

const CORE_ROOM_FIELDS = gql`
  fragment CoreRoomFields on Chatroom {
    id
    room_code
  }
`;

const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id
    email
    username
    profile_pic
  }
`;

export const CREATECHATROOM = gql`
  mutation Mutation($data: InsertChatroomInput) {
    insertChatroom(data: $data) {
      ...CoreRoomFields
    }
  }
  ${CORE_ROOM_FIELDS}
`;

export const GETALLCHATER = gql`
  subscription NewChatroom {
    newChatroom {
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

export const INSERTMSG = gql`
  mutation NewMessage($data: InsertMessageInput) {
    insertMessage(data: $data) {
      id
    }
  }
`;

export const SUBSCRIBETONEWMSG = gql`
  subscription NewMessage {
    newMessage {
      id
      message
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

export const GETALLMSGS = gql`
  query ListMessages($filter: MessagesfilterInput) {
    listMessages(filter: $filter) {
      id
      message
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

export const DELETECHATROOM = gql`
  mutation DeleteChatroom($data: InsertChatroomInput) {
    softDeleteChatroom(data: $data) {
      ...CoreRoomFields
    }
  }
  ${CORE_ROOM_FIELDS}
`;

export const GETALLUSERS = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      id
      username
    }
  }
`;
