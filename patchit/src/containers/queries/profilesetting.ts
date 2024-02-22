import { gql } from "@apollo/client";

export const UPSERTUSERPREFERENCES = gql`
mutation UpsertUserPreference($data: InsertUserPreferencesInput) {
  upsertUserPreference(data: $data) {
   id
  }
}`
;

export const GETUSERPREFERENCE = gql`
query Userpreference($userId: Int!) {
  userpreference(userId: $userId) {
    id
    user_id {
      id
      username
      email
      status
      profile_pic
      background_pic
      about
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