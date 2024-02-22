export const userpreferencesTypeDefs = `
  enum SENDMSG {
    ANYONE,
    NONE,
    FOLLOWERS
  }

  type UserPreferences {
    id: Int
    user_id: User
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
  } 

  input InsertUserPreferencesInput {
    user_id: Int! 
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
    sendmsg: String
    announcements: Boolean
    searchshowprofile: Boolean
    auth_twofactor: Boolean
  }
  input UserPreferencesfilterInput {
    user_id: Int 
    nsfw: Boolean
    visiblity: Boolean
    show_nsfw: Boolean
    allowppltofollow: Boolean
    contentvisiblity: Boolean
    chatreq: Boolean
    mentionusername: Boolean
    activityonpost: Boolean
    activityoncmnt: Boolean
    sendmsg: String
    activityonpostfollowed: Boolean
    patcoinreceived: Boolean
    communityfollowed: Boolean
    birthday: Boolean
    announcements: Boolean
    searchshowprofile: Boolean
    auth_twofactor: Boolean
  }
  input RemoveUserPreferencesInput {
    user_id: Int!
  }
`;
