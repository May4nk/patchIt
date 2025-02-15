import { gql } from "@apollo/client";
import { COMMUNITY_BASIC_FIELDS } from "../../containers/queries/community";

export const CREATECOMMUNITY = gql`
  mutation CreateCommunity($data: UpsertCommunityInput) {
    upsertCommunity(data: $data) {
      id
      name
    }
  }
`;

export const COMMUNITIESNAME = gql`
  query ListCommunities($filter: CommunitiesfilterInput) {
    listCommunities(filter: $filter) {
      id
      name
    }
  }
`;

export const GETCATEGORIES = gql`
  query ListCategories {
    listCategories {
      id
      categoryname
      categoryicon
    }
  }
`;

export const GETUSERCOMMUNITIES = gql`
  query ListUsersCommunity($filter: UserCommunityfilterInput) {
    listUsersCommunity(filter: $filter) {
      id
      community_id {
        ...communityBasicFields
      }
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
`;

export const GETNOTIFICATIONS = gql`
  query ListNotifications(
    $sort: [SortInput]
    $filter: NotificationfilterInput
  ) {
    listNotifications(sort: $sort, filter: $filter) {
      id
      type
      status
      message
      fromuser {
        id
        username
        profile_pic
      }
    }
  }
`;

export const UPDATENOTIFICATION = gql`
  mutation UpsertNotification($data: InsertNotificationInput) {
    upsertNotification(data: $data) {
      id
    }
  }
`;

export const SUBSCRIBETONOTIFICATION = gql`
  subscription NewNotification($type: NOTIFICATIONTYPE!, $userId: String!) {
    newNotification(type: $type, userId: $userId) {
      id
      type
      status
      message
      fromuser {
        id
        username
        profile_pic
      }
    }
  }
`;

export const FOLLOWUSER = gql`
  mutation InsertUserFollowing($data: InsertUserFollowingInput) {
    insertUserFollowing(data: $data) {
      id
    }
  }
`;
