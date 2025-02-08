import { gql } from "@apollo/client";
import { COMMUNITY_BASIC_FIELDS } from "../queries/community";
import { USER_ID_USERNAME } from "../queries/user";

export const GETCOMMUNITYPREFERENCE = gql`
  query Communitypreference($communityName: String!) {
    communitypreference(communityName: $communityName) {
      id
      community_name {
        ...communityBasicFields
        about
        background_pic
        description
        status
        privacy
        social_links
        theme
        owner {
          ...userIdNameFields
        }
      }
      handlers {
        id
      }
      nsfw
      allowppltofollow
      newuserreq
      reportonpost
      reportoncmnt
      reportonuser
      activityincommunity
      birthday
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
  ${USER_ID_USERNAME}
`;

export const UPSERTCOMMUNITYPREFERENCE = gql`
  mutation UpsertCommunityPreference($data: InsertCommunityPreferencesInput) {
    upsertCommunityPreference(data: $data) {
      id
    }
  }
`;

export const UPSERTCOMMUNITY = gql`
  mutation UpsertCommunity($data: UpsertCommunityInput) {
    upsertCommunity(data: $data) {
      id
    }
  }
`;
