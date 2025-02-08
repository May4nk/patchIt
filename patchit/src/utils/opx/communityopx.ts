import {
  communitysettingstateactiontype,
  communitysettingstatetype,
  handlecommunitysettingstatetype,
} from "../../containers/communitySettings/types";
import {
  communitystateactiontype,
  communitystatetype,
  handlecommunitystatetype,
} from "../../containers/types/community";

export function changeToThemeColor(color: string) {
  const eleThemeBg = document.querySelectorAll(
    ".themebg"
  ) as NodeListOf<HTMLElement>;

  const eleThemeColor = document.querySelectorAll(
    ".themecolor"
  ) as NodeListOf<HTMLElement>;

  const eleThemeMetaTxt = document.querySelectorAll(
    ".thememetanhtext"
  ) as NodeListOf<HTMLElement>;

  const eleThemeInactiveBtnBg = document.querySelectorAll(
    ".themeinactivebtnbg"
  ) as NodeListOf<HTMLElement>;

  if (eleThemeColor) {
    eleThemeColor.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-color: color-mix(in srgb, ${color} 80%, rgba(255, 255, 255, 0.8) 20%)`;
    });
  }

  if (eleThemeBg) {
    eleThemeBg.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-background-color: ${color}`;
    });
  }

  if (eleThemeMetaTxt) {
    eleThemeMetaTxt.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-meta-no-highlight-text-color: color-mix(
        in srgb, ${color} 10%, rgba(255, 255, 255, 0.4) 90%
      )`;
    });
  }

  if (eleThemeInactiveBtnBg) {
    eleThemeInactiveBtnBg.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-background-inactive-color: color-mix(in srgb, ${color} 60%, black 40%)`;
    });
  }
}

// state
export const communityInitState: communitystatetype = {
  pic: [],
  status: "ACTIVE",
  inCommunity: false,
  display_profile_pic: null,
  display_background_pic: null,
  error: { status: 0, message: "", show: false },
  settings: { nsfw: false, allowppltofollow: true },
};

export const handleCommunityState: handlecommunitystatetype = (
  state: communitystatetype,
  action: communitystateactiontype
) => {
  switch (action.type) {
    case "UPDATE_COMMUNITY_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
        },
      };

    case "SET_PIC":
      return { ...state, pic: action.pic };

    case "UPDATE_IN_COMMUNITY":
      return { ...state, inCommunity: action.inCommunity };

    case "UPDATE_PIC":
      return { ...state, display_profile_pic: action.profile_pic };

    case "UPDATE_BG_PIC":
      return { ...state, display_background_pic: action.background_pic };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "RESET":
      return state;

    default:
      return state;
  }
};

export const communitySettingsInitState: communitysettingstatetype = {
  isUpdating: false,
  settingActiveTab: "privacy",
  deleteCommunity: false,
  display_profile_pic: null,
  display_background_pic: null,
  error: { status: 0, message: "", show: false },
  privacyState: {
    nsfw: false,
    handlers: [],
  },
  communityData: {
    owner: "",
    theme: "",
    about: "",
    privacy: "PUBLIC",
    profile_pic: null,
    description: "",
    social_links: null,
    background_pic: null,
  },
  notificationState: {
    birthday: false,
    newuserreq: false,
    reportonpost: false,
    reportoncmnt: false,
    reportonuser: false,
    activityincommunity: false,
  },
};

//handler
export const handleCommunitySettingState: handlecommunitysettingstatetype = (
  state: communitysettingstatetype,
  action: communitysettingstateactiontype
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

    case "UPDATE_PRIVACY_SETTINGS":
      return {
        ...state,
        privacyState: {
          ...state.privacyState,
          ...action.privacySettings,
        },
      };

    case "UPDATE_COMMUNITYDATA":
      return {
        ...state,
        communityData: {
          ...state.communityData,
          ...action.communityData,
        },
      };

    case "DELETE_ACCOUNT":
      return { ...state, deleteAcc: action.deleteAcc };

    case "SET_UPDATE":
      return { ...state, isUpdating: action.update };

    case "SET_ACTIVE_TAB":
      return { ...state, settingActiveTab: action.selectedTab };

    case "UPDATE_PIC":
      return { ...state, display_profile_pic: action.profile_pic };

    case "UPDATE_BG_PIC":
      return { ...state, display_background_pic: action.background_pic };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "RESET":
      return state;

    default:
      return state;
  }
};
