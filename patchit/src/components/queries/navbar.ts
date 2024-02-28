import { gql } from "@apollo/client";

export const GETUSERCOMMUNITIES = gql`
query ListUsersCommunity($filter: UserCommunityfilterInput) {
  listUsersCommunity(filter: $filter) {
    id
    community_id {
      id
      communityname
      profile_pic
    }
  }
}
`;
