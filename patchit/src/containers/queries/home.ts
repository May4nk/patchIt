import { gql } from "@apollo/client"

export const GETALLPOSTFORHOME = gql`
query ListUsersCommunity($filter: UserCommunityfilterInput, $sort: [SortInput]) {
  listUsersCommunity(filter: $filter, sort: $sort) {
    community_id {
      posts {
        id
        title
        type
        content
        likes
        status
        owner {
          id
          username
          profile_pic
        }
        community_id {
          id
          communityname
          profile_pic      
        }
      }
    }
  }
}
`;