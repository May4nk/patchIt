import { gql } from "@apollo/client";
import { USER_ID_USERNAME } from "./user";
import { CORE_POST_FIELDS } from "../../utils/main/fragments";

export const COMMUNITY_BASIC_FIELDS = gql`
  fragment communityBasicFields on Community {
    id
    name
    profile_pic
  }
`;

const COMMUNITY_FIELDS = gql`
  fragment communityFields on Community {
    ...communityBasicFields
    display_name
    description
    about
    background_pic
    created_at
    privacy
    theme
    status
    social_links
    owner {
      ...userIdNameFields
    }
  }
  ${COMMUNITY_BASIC_FIELDS}
  ${USER_ID_USERNAME}
`;

export const GETCOMMUNITY = gql`
  query Community($communityname: String!) {
    community(communityname: $communityname) {
      ...communityFields
      posts {
        ...CorePostFields
      }
      users {
        id
        user_id {
          id
        }
      }
      settings {
        nsfw
        allowppltofollow
      }
    }
  }
  ${CORE_POST_FIELDS}
  ${COMMUNITY_FIELDS}
`;
