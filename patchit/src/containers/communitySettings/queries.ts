import { gql } from "@apollo/client";

export const GETCOMMUNITYPREFERENCE = gql`
  query Communitypreference($communityName: String!) {
    communitypreference(communityName: $communityName) {
      id
      community_name {
        id
        communityname
        about
        background_pic
        profile_pic
        description
        status
        privacy
        social_links
        theme
        owner {
          id
          username
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
