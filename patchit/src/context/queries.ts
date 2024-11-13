import { gql } from "@apollo/client";

export const GETLOGGEDUSER = gql`
  query ListUsers($filter: UsersfilterInput) {
    listUsers(filter: $filter) {
      new_user
      profile_pic
      settings {
        nsfw
        visiblity
        show_nsfw
        allowppltofollow
        contentvisiblity
        chatreq
        mentionusername
        activityonpost
        activityoncmnt
        activityonpostfollowed
        patcoinreceived
        communityfollowed
        birthday
        announcements
        sendmsg
        searchshowprofile
        auth_twofactor
        blocked
      }
    }
  }
`;
