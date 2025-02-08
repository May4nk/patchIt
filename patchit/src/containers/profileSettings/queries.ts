import { gql } from "@apollo/client";
import { USER_BASIC_FIELDS } from "../queries/user";

export const UPSERTUSERPREFERENCES = gql`
  mutation UpsertUserPreference($data: InsertUserPreferencesInput) {
    upsertUserPreference(data: $data) {
      id
    }
  }
`;

export const GETUSERPREFERENCE = gql`
  query Userpreference($username: String!) {
    userpreference(username: $username) {
      user {
        ...userBasicFields
        background_pic
        social_links
      }
    }
  }
  ${USER_BASIC_FIELDS}
`;
