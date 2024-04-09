import { gql } from "@apollo/client";

export const LISTUSERS = gql`
  query ListUsers {
    listUsers {
      id
      username
      email
    }
  }
`;

export const SIGNUPUSER = gql`
  mutation UpsertUser($data: InsertUserInput) {
    insertUser(data: $data) {
      id
      username
      email
    }
  }
`;

export const LOGINUSER = gql`
  mutation Login($data: LoginUserInput) {
    loginUser(data: $data) {
      id
      username
      email
      token
      new_user
      role {
        id
      }
    }
  }
`;

export const MAGICLINKLOGIN = gql`
  mutation MagicloginUser($data: MagicLinkLoginInput) {
    magicloginUser(data: $data) {
      id
      username
      email
      token
      new_user
      role {
        id
      }
    }
  }
`;

export const UPDATEUSER = gql`
  mutation Mutation($data: InsertUserInput) {
    updateUser(data: $data) {
      id
    }
  }
`;

export const GETUSERBYTOKEN = gql`
  query Token($filter: TokenfilterInput) {
    listTokens(filter: $filter) {
      user_id {
        id
        username
        new_user
        email
        role {
          id
        }
      }
    }
  }
`;
