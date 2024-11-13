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
    handlers: [User]
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
    handlers: String
  }

  input CommunityPreferencesfilterInput {
    community_name: String
    nsfw: Boolean
    allowppltofollow: Boolean
    newuserreq: Boolean
    reportonpost: Boolean
    reportoncmnt: Boolean
    reportonuser: Boolean
    birthday: Boolean
    activityincommunity: Boolean
  }

  input RemoveCommunityPreferencesInput {
    community_name: Int!
  }
`;
