import { gql } from "@apollo/client";

export const GETUSERCHATROOMS = gql`
query ListSpecificUserChatrooms($userId: Int!) {
  listSpecificUserChatrooms(userId: $userId) {
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

export const USERCHATROOM = gql`
query ListUserChatrooms($filter: UserChatroomfilterInput, $sort: [SortInput], $limit: Int) {
  listUserChatrooms(filter: $filter, sort: $sort, limit: $limit) {
    users {
      id
      room_id {
        id
        room_code
      }
      user_id {
        username
      }
    }
  }
}
`;

export const SUBSCRIBETONEWMSG = gql `
  subscription Subscription {
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
  subscription Subscription($userId: Int!){
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