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
        role_id
      }
    }
  }
`;

export const MAGICLINKLOGIN = gql`
  mutation MagicloginUser($data: MagicLinkLoginInput) {
    magicloginUser(data: $data)
  }
`;

export const UPDATEUSER = gql`
  mutation UpdateUser($data: InsertUserInput) {
    updateUser(data: $data) {
      id
    }
  }
`;

export const GETMAGICTOKENUSER = gql`
  query VerifyMagicToken($token: String!) {
    verifyMagicToken(token: $token) {
      id
      username
      email
      token
      role {
        id
      }
      new_user
    }
  }
`;

export const LOGOUTUSER = gql`
  mutation LogoutUser($userId: String!) {
    logoutUser(userId: $userId)
  }
`;

export const REFRESHTOKEN = gql`
  mutation RefreshToken {
    refreshToken {
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

export const CHANGEPASSWORD = gql`
  mutation ChangePassword($data: ChangePasswordInput) {
    changePassword(data: $data) {
      id
    }
  }
`;

export const REQUESTFORGETPASSWORD = gql`
  mutation RequestForgetPassword($data: RequestForgetPasswordInput) {
    requestForgetPassword(data: $data)
  }
`;

export const FORGETPASSWORD = gql`
  mutation ForgetPassword($data: ForgetPasswordInput) {
    forgetPassword(data: $data)
  }
`;
