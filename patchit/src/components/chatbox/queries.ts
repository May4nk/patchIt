import { gql } from "@apollo/client";

export const GETUSERCHATROOMS = gql`
query ListUserChatrooms($sort: [SortInput], $limit: Int, $filter: UserChatroomfilterInput) {
  listUserChatrooms(sort: $sort, limit: $limit, filter: $filter){
    id
    room_id {
      id
      room_code
    }
    user_id {
      id
      email
      profile_pic
      username
    }   
    users {
      id
      username
      email
      profile_pic
    }
  }
}
`;

export const SUBSCRIBETONEWMSG = gql `
  subscription NewMessage {
    newMessage {
      id
      message
      room_id {
        id
        room_code
      }
      user_id {
        id
        email
        username
        status
        profile_pic        
      }
    }
  }
`;

export const CREATECHATROOM = gql`
  mutation Mutation($data: InsertChatroomInput) {
    insertChatroom(data: $data) {
      id
      room_code
    }
  }
`;

export const INSERTUSERCHATROOM = gql`
  mutation InsertUserChatroom($data: [InsertUserChatroomInput!]!) {
    insertUserChatroom(data: $data) {
      id
      room_id {
        id
        room_code
      }
      user_id {
        id
        email
        username
        profile_pic        
        status
      }
    }
  }
`;

export const SUBSCRIBETOUSERCHATROOMS = gql`
  subscription UserChatroom($userId: Int!){
    newUserChatroom(userId: $userId) {
      id
      room_id {
        id
        room_code
      }
      user_id {
        id
        email
        profile_pic
        username
      }
    }
  }
`;

export const GETALLCHATER = gql `
subscription NewChatroom {
  newChatroom {
    room_code
    id
  }
}
`;

export const INSERTMSG = gql`
mutation Mutation($data: InsertMessageInput) {
  insertMessage(data: $data){
    id
  }
}
`;

export const GETALLMSGS = gql `
  query ListMessages($filter: MessagesfilterInput) {
    listMessages(filter: $filter) {
      id
      message
      room_id {
        id
        room_code
      }
      user_id {
        id
        email
        username
        status
        profile_pic        
      }
    }
  }
`;


export const DELETECHATROOM = gql`
  mutation Mutation($data: InsertChatroomInput) {
    softDeleteChatroom(data: $data) {
      id
      room_code
      status
    }
  }
`;

export const GETALLUSERS = gql`
query ListUsers($filter: UsersfilterInput) {
  listUsers(filter: $filter) {
    id
    username
    dob
    status
  }
}
`;