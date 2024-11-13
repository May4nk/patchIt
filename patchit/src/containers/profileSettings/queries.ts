import { gql } from "@apollo/client";

export const UPSERTUSERPREFERENCES = gql`
  mutation UpsertUserPreference($data: InsertUserPreferencesInput) {
    upsertUserPreference(data: $data) {
      id
    }
  }
`;

export const GETUSERPREFERENCE = gql`
  query Userpreference($userId: Int!) {
    userpreference(userId: $userId) {
      user_id {
        id
        username
        email
        privacy
        profile_pic
        background_pic
        about
        social_links
      }
    }
  }
`;
