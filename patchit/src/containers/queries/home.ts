import { gql } from "@apollo/client";
import { CORE_POST_FIELDS } from "../../utils/main/fragments";

export const GETALLPOSTFORHOME = gql`
  query ListUsersCommunity(
    $filter: UserCommunityfilterInput
    $sort: [SortInput]
  ) {
    listUsersCommunity(filter: $filter, sort: $sort) {
      community_id {
        posts {
          ...CorePostFields
        }
      }
    }
  }
  ${CORE_POST_FIELDS}
`;
