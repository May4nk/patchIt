import {
  handleusersettingstatetype,
  usersettingstateactiontype,
  usersettingstatetype,
} from "../../containers/profileSettings/types";
import {
  handlenewuserstatetype,
  newuserstateactiontype,
  newuserstatetype,
  selectedcommunitytype,
} from "../../containers/types/newusersetuptypes";
import {
  handleuserstatetype,
  userstateactiontype,
  userstatetype,
} from "../../containers/types/user";

//user ------------------------------------------------------------------------------------
export const userInitState: userstatetype = {
  activeTab: "posts",
  display_profile_pic: null,
  display_background_pic: null,
  settings: {
    nsfw: false,
    isNew: false,
    following: "FOLLOW",
    isProfilePrivate: true,
    allowPplToFollow: true,
  },
  error: { status: 0, message: "", show: false },
};

export const handleUserState: handleuserstatetype = (
  state: userstatetype,
  action: userstateactiontype
) => {
  switch (action.type) {
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
        },
      };

    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.selectedTab };

    case "UPDATE_BG_PIC":
      return { ...state, display_background_pic: action.background_pic };

    case "UPDATE_PIC":
      return { ...state, display_profile_pic: action.profile_pic };

    case "SET_ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
};

//user settings------------------------------------------------------------------------------------------

export const userSettingInitState: usersettingstatetype = {
  deleteAcc: false,
  settingActiveTab: "profile",
  isUpdating: false,
  display_profile_pic: null,
  display_background_pic: null,
  error: { status: 0, message: "", show: false },
  chatState: { sendmsg: "ANYONE" },
  feedsState: { show_nsfw: false },
  profileState: {
    nsfw: false,
    allowppltofollow: false,
    contentvisiblity: false,
  },
  notificationState: {
    chatreq: false,
    birthday: false,
    announcements: false,
    activityonpost: false,
    activityoncmnt: false,
    patcoinreceived: false,
    mentionusername: false,
    communityfollowed: false,
    activityonpostfollowed: false,
  },
  privacyState: {
    blocked: "",
    auth_twofactor: false,
    searchshowprofile: false,
  },
  userData: {
    email: "",
    about: "",
    username: "",
    privacy: "PUBLIC",
    status: "ACTIVE",
    profile_pic: null,
    background_pic: null,
    social_links: "",
  },
};

export const handleUserSettingState: handleusersettingstatetype = (
  state: usersettingstatetype,
  action: usersettingstateactiontype
) => {
  switch (action.type) {
    case "UPDATE_NOTIFICATION_SETTINGS":
      return {
        ...state,
        notificationState: {
          ...state.notificationState,
          ...action.notifySettings,
        },
      };

    case "UPDATE_FEED_SETTINGS":
      return {
        ...state,
        feedsState: {
          ...state.feedsState,
          ...action.feedSettings,
        },
      };

    case "UPDATE_BG_PIC":
      return { ...state, display_background_pic: action.background_pic };

    case "UPDATE_PIC":
      return { ...state, display_profile_pic: action.profile_pic };

    case "UPDATE_PRIVACY_SETTINGS":
      return {
        ...state,
        privacyState: {
          ...state.privacyState,
          ...action.privacySettings,
        },
      };

    case "UPDATE_CHAT_SETTINGS":
      return {
        ...state,
        chatState: {
          ...state.chatState,
          ...action.chatSettings,
        },
      };

    case "UPDATE_PROFILE_SETTINGS":
      return {
        ...state,
        profileState: {
          ...state.profileState,
          ...action.profileSettings,
        },
      };

    case "UPDATE_USERDATA":
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.userData,
        },
      };

    case "DELETE_ACCOUNT":
      return { ...state, deleteAcc: action.deleteAcc };

    case "SET_UPDATE":
      return { ...state, isUpdating: action.update };

    case "SET_ACTIVE_TAB":
      return { ...state, settingActiveTab: action.selectedTab };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "RESET":
      return state;

    default:
      return state;
  }
};

// new user -------------------------------------------
export const newUserSetupInitState: newuserstatetype = {
  level: 0,
  userCommunities: [],
  display_profile_pic: null,
  display_background_pic: null,
  error: { show: false, status: 0, message: "" },
  userInfo: {
    about: "",
    profile_pic: "",
    new_user: false,
    background_pic: "",
  },
};

export const handleNewUserState: handlenewuserstatetype = (
  state: newuserstatetype,
  action: newuserstateactiontype
) => {
  switch (action.type) {
    case "SET_LEVEL":
      if (action.level > 3) {
        return { ...state, level: state.level };
      }

      return { ...state, level: action.level };

    case "UPDATE_USERINFO":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.info,
        },
      };

    case "UPDATE_PIC":
      return { ...state, display_profile_pic: action.profile_pic };

    case "UPDATE_BG_PIC":
      return { ...state, display_background_pic: action.background_pic };

    case "ADD_USERCOMMUNITY":
      return {
        ...state,
        userCommunities: [...state.userCommunities, action.community],
      };

    case "DEL_USERCOMMUNITY":
      return {
        ...state,
        userCommunities: state.userCommunities.filter(
          (community: selectedcommunitytype) =>
            community.community_id !== action.communityId
        ),
      };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "RESET":
      return newUserSetupInitState;

    default:
      return state;
  }
};
