import { gql } from "@apollo/client";
import { COMMUNITY_BASIC_FIELDS } from "../../containers/queries/community";

export const GETCOMMUNITIES = gql`
  query ListCommunities($filter: CommunitiesfilterInput, $limit: Int) {
    listCommunities(filter: $filter, limit: $limit) {
      ...communityBasicFields
      posts {
        id
      }
      owner {
        id
      }
      users {
        id
      }
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const GETRECOMMENDEDPOSTS = gql`
  query ListPosts($limit: Int, $sort: [SortInput], $filter: PostfilterInput) {
    listPosts(limit: $limit, sort: $sort, filter: $filter) {
      id
      likes
      title
      type
      owner {
        id
        username
        profile_pic
        status
      }
      comments {
        id
      }
      community_id {
        ...communityBasicFields
        owner {
          id
        }
      }
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const INSERTUSERCOMMUNITY = gql`
  mutation InsertUserCommunity($data: InsertUserCommunityInput) {
    insertUserCommunity(data: $data) {
      id
    }
  }
`;

export const REMOVEUSERCOMMUNITY = gql`
  mutation RemoveUserCommunity($data: RemoveUserCommunityInput) {
    removeUserCommunity(data: $data) {
      id
    }
  }
`;

export const SENDFOLLOWREQ = gql`
  mutation UpsertNotification($data: InsertNotificationInput) {
    upsertNotification(data: $data) {
      id
    }
  }
`;

export const REMOVEFOLLOWREQ = gql`
  mutation RemoveNotification($data: RemoveNotificationInput) {
    removeNotification(data: $data) {
      id
    }
  }
`;

export const REMOVEFOLLOWER = gql`
  mutation RemoveUserFollowing($data: RemoveUserFollowingInput) {
    removeUserFollowing(data: $data) {
      id
    }
  }
`;
