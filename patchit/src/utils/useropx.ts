import { Reducer } from "react";
import { usersettinginfoactiontype, usersettinginfotype } from "./types";

export const intialUserSetting: usersettinginfotype = {
  nsfw: false,
  isNew: false,
  privacy: "PUBLIC",
  showProfile: true,
  following: "FOLLOW",
  allowPplToFollow: true,
};

export const userReducer: Reducer<
  usersettinginfotype,
  usersettinginfoactiontype
> = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        ...action.payload,
      };

    case "UPDATE_SHOW_PROFILE":
      return {
        ...state,
        showProfile: action.payload.showProfile || state?.showProfile,
      };

    case "UPDATE_FOLLOWING":
      return {
        ...state,
        following: action.payload.following || state?.following,
      };

    default:
      return state;
  }
};
