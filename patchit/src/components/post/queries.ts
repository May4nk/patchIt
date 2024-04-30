import { gql } from "@apollo/client";

export const UPDATEPOLL = gql`
  mutation Mutation($data: InsertPollInput) {
    upsertPolls(data: $data) {
      id
    }
  }
`;

export const GETPOLL = gql`
  query ListPolls($filter: PollfilterInput) {
    listPolls(filter: $filter) {
      id
      pollvalue
    }
  }
`;
