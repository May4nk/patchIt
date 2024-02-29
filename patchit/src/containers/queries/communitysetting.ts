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
      privacy      
      theme
      status
      owner {
        id
        username
      }
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
