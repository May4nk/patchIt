import { gql } from "@apollo/client";

export const GETCOMMUNITIES = gql`
  query ListCommunities($filter: CommunitiesfilterInput, $limit: Int) {
    listCommunities(filter: $filter, limit: $limit) {
      id
      communityname
      profile_pic
      posts {
        id
      }
      users {
        id
      }
    }
  }
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
        id
        communityname
        profile_pic
      }
    }
  }
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
