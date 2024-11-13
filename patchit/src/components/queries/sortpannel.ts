import { gql } from "@apollo/client";

export const GETUSERPINNEDPOST = gql`
  query ListSavedPost($filter: SavedPostfilterInput) {
    listSavedPost(filter: $filter) {
      post_id {
        id
        title
      }
    }
  }
`;
