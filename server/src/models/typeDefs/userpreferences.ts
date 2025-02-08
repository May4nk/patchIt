export const userpreferencesTypeDefs = `
  enum SENDMSG {
    ANYONE
    NONE
    FOLLOWERS
  }

  type UserPreferences {
    id: String
    user: User
    nsfw: Boolean
    visiblity: Boolean
    show_nsfw: Boolean
    allowppltofollow: Boolean
    contentvisiblity: Boolean
    chatreq: Boolean
    mentionusername: Boolean
    activityonpost: Boolean
    activityoncmnt: Boolean
    activityonpostfollowed: Boolean
    patcoinreceived: Boolean
    communityfollowed: Boolean
    birthday: Boolean
    announcements: Boolean
    sendmsg: SENDMSG
    searchshowprofile: Boolean
    auth_twofactor: Boolean
    blocked: String
  } 

  input InsertUserPreferencesInput {
    user: String! 
    nsfw: Boolean
    visiblity: Boolean
    show_nsfw: Boolean
    allowppltofollow: Boolean
    contentvisiblity: Boolean
    chatreq: Boolean
    mentionusername: Boolean
    activityonpost: Boolean
    activityoncmnt: Boolean
    activityonpostfollowed: Boolean
    patcoinreceived: Boolean
    communityfollowed: Boolean
    birthday: Boolean
    sendmsg: SENDMSG
    announcements: Boolean
    searchshowprofile: Boolean
    auth_twofactor: Boolean
    blocked: String
  }
  
  input RemoveUserPreferencesInput {
    user: String!
  }
`;
