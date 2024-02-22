import { gql } from "@apollo/client";

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id 
    username
  }
`;

//chatmsg
export const GETALLUSERS = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      ...CoreUserFields
      dob
      status
    }
  }
  ${CORE_USER_FIELDS}
`;
