export const communitypreferencesTypeDefs = `
  type CommunityPreferences {
    id: Int
    community_name: Community!
    nsfw: Boolean
    allowppltofollow: Boolean
    newuserreq: Boolean
    reportonpost: Boolean
    reportoncmnt: Boolean
    reportonuser: Boolean
    activityincommunity: Boolean
    birthday: Boolean
  } 

  input InsertCommunityPreferencesInput {
    community_name: String!
    nsfw: Boolean
    allowppltofollow: Boolean
    newuserreq: Boolean
    reportonpost: Boolean
    reportoncmnt: Boolean
    reportonuser: Boolean
    activityincommunity: Boolean
    birthday: Boolean
  }
  input CommunityPreferencesfilterInput {
    community_name: Int
    nsfw: Boolean
    allowppltofollow: Boolean
    newuserreq: Boolean
    reportonpost: Boolean
    reportoncmnt: Boolean
    reportonuser: Boolean
    activityincommunity: Boolean
    birthday: Boolean
  }
  input RemoveCommunityPreferencesInput {
    community_name: Int!
  }
`;
