import React, { useEffect, useReducer } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

//utils
import { getSignedUrls } from "../../utils/services/s3";
import { useAuth, useLogged } from "../../utils/hooks/useAuth";
import { handleUserSettingState, userSettingInitState } from "../../utils/opx/useropx";

//components
import Chattab from "./Chattab";
import Feedtab from "./Feedtab";
import Privacytab from "./Privacytab";
import Accounttab from "./Accounttab";
import Profiletab from "./Profiletab";
import Modal from "../../components/Modal";
import Notificationtab from "./Notificationtab";
import Htabs from "../../components/html/Htabs";
import Loadingpage from "../../components/Loadingpage";
import Errorcard from "../../components/cards/Errorcard";

//queries
import { UPDATEUSER } from "../../utils/loginqueries";
import { GETUSERPREFERENCE, UPSERTUSERPREFERENCES } from "./queries";

//css & types
import "../css/main.css";
import "./profilesettings.css";
import { USER_S_N_TYPE } from "../../utils/main/types";
import { signedfiletype, signedurltype } from "../../utils/types";
import { authcontexttype, loggedusercontexttype } from "../../context/types";
import {
  profilesettingtabs,
  handleupdatetype,
  userdatatype,
  usersettingtypes,
  handlechangetype
} from "./types.js"

const Profilesetting = () => {
  const navigate = useNavigate();
  const { uname } = useParams();

  const { user, logout }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userRole: number | null = user && user["role"];
  const { loggedUser }: loggedusercontexttype = useLogged();
  const usettings: loggedusercontexttype["loggedUser"] = user && loggedUser;

  //queries
  const [updateUser] = useMutation(UPDATEUSER);
  const [updateUserSettings] = useMutation(UPSERTUSERPREFERENCES);
  const [getUserSettings, { loading, error }] = useLazyQuery(GETUSERPREFERENCE);

  //handlers
  const settingTabs: profilesettingtabs[] = [
    ...(userRole !== 1337 ? ["account" as profilesettingtabs] : []),
    "profile",
    "privacy",
    "notifications",
    "feeds",
    "chat",
  ];

  const [userSettingState, dispatch] = useReducer(handleUserSettingState, userSettingInitState);

  const handleChange: handlechangetype = (e: any, statename: usersettingtypes) => {
    if (statename === "profile") {
      dispatch({
        type: "UPDATE_PROFILE_SETTINGS",
        profileSettings: {
          [e.target.name]: e.target.checked
        }
      });
    } else if (statename === "feeds") {
      dispatch({
        type: "UPDATE_FEED_SETTINGS",
        feedSettings: {
          [e.target.name]: e.target.checked
        }
      });
    } else if (statename === "notifications") {
      dispatch({
        type: "UPDATE_NOTIFICATION_SETTINGS",
        notifySettings: {
          [e.target.name]: e.target.checked
        }
      });
    } else if (statename === "privacy") {
      dispatch({
        type: "UPDATE_PRIVACY_SETTINGS",
        privacySettings: {
          [e.target.name]: e.target.checked
        }
      });
    } else if (statename === "chat") {
      dispatch({
        type: "UPDATE_CHAT_SETTINGS",
        chatSettings: {
          [e.target.name]: e.target.checked
        }
      });
    };

    dispatch({ type: "SET_UPDATE", update: true });
  };

  const update: handleupdatetype = async (toUpdate: keyof userdatatype, value: string) => {
    try {
      await updateUser({
        variables: {
          data: {
            id: userId,
            [toUpdate]: value
          }
        },
      });

      return "Settings updated  successfully";

    } catch (err) {
      throw Error("Something went wrong: Setting update failed. Try again later");
    }
  }

  const handleDeleteAcc: () => Promise<void> = async () => {
    try {
      await update("status", "INACTIVE");
      dispatch({ type: "DELETE_ACCOUNT", deleteAcc: true });
      logout();
    } catch (err) {
      dispatch({ type: "DELETE_ACCOUNT", deleteAcc: false });
      dispatch({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Something went wrong DELETING your account. Try again later",
        }
      });
    }
  };

  const handleUpdateChanges: () => Promise<void> = async () => {
    try {
      await updateUserSettings({
        variables: {
          data: {
            user_id: userId,
            ...userSettingState?.privacyState,
            ...userSettingState?.notificationState,
            ...userSettingState?.feedsState,
            ...userSettingState?.profileState,
            blocked: JSON.stringify(userSettingState?.privacyState.blocked),
          }
        },
        onCompleted: () => {
          dispatch({ type: "SET_UPDATE", update: false });
          dispatch({
            type: "SET_ERROR",
            error: {
              show: true,
              status: 200,
              message: "Settings updated successfully...",
            }
          });
        }
      })
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Settings update failed: Something went wrong",
        }
      });
    }
  }

  const handleUserOptions: (uoption: profilesettingtabs) => void = (uoption: profilesettingtabs) => {
    const activeTab = document.querySelector(`.tab${userSettingState?.settingActiveTab}`);
    if (activeTab) {
      activeTab?.classList?.remove("selected");
    }

    dispatch({ type: "SET_ACTIVE_TAB", selectedTab: uoption });

    const selectedTab = document.querySelector(`.tab${uoption}`);
    if (selectedTab) {
      selectedTab?.classList?.add("selected");
    }
  }

  useEffect(() => {
    if (usettings) {
      dispatch({ type: "UPDATE_CHAT_SETTINGS", chatSettings: { sendmsg: usettings?.sendmsg! } });
      dispatch({ type: "UPDATE_FEED_SETTINGS", feedSettings: { show_nsfw: usettings?.show_nsfw! } });
      dispatch({
        type: "UPDATE_PRIVACY_SETTINGS",
        privacySettings: {
          blocked: usettings.blocked!,
          auth_twofactor: usettings?.auth_twofactor!,
          searchshowprofile: usettings?.searchshowprofile!,
        }
      });

      dispatch({
        type: "UPDATE_PROFILE_SETTINGS",
        profileSettings: {
          nsfw: usettings?.nsfw!,
          allowppltofollow: usettings?.allowppltofollow!,
          contentvisiblity: usettings?.contentvisiblity!,
        }
      });

      dispatch({
        type: "UPDATE_NOTIFICATION_SETTINGS",
        notifySettings: {
          chatreq: usettings?.chatreq!,
          mentionusername: usettings?.mentionusername!,
          activityonpost: usettings?.activityonpost!,
          activityoncmnt: usettings?.activityoncmnt!,
          activityonpostfollowed: usettings?.activityonpostfollowed!,
          patcoinreceived: usettings?.patcoinreceived!,
          communityfollowed: usettings?.communityfollowed!,
          birthday: usettings?.birthday!,
          announcements: usettings?.announcements!,
        }
      });
    }
  }, [usettings]);

  useEffect(() => {
    if (!user) (navigate("/home"));

    getUserSettings({
      variables: {
        username: uname
      },
      onCompleted: ({ userpreference }: { userpreference: { user: userdatatype } }) => {
        if (userpreference.user) {
          const userprofile: userdatatype = userpreference?.user;

          if (userprofile) {
            const profile_pic: USER_S_N_TYPE = userprofile.profile_pic;
            const background_pic: USER_S_N_TYPE = userprofile.background_pic;

            if (profile_pic || background_pic) {
              const images: signedfiletype[] = [];

              if (background_pic !== null && background_pic.length > 0) {
                images.push({ name: background_pic })
              }

              if (profile_pic !== null && profile_pic.length > 0) {
                images.push({ name: profile_pic })
              }

              if (images.length > 0) {
                (async function () {
                  const signedUrls: signedurltype[] = await getSignedUrls({
                    userId: userId!,
                    postId: "0",
                    req: "GET",
                    files: images
                  });

                  signedUrls.map((url: signedurltype) => (
                    url.fileUrl.includes(`profile_pic`)
                      ? dispatch({ type: "UPDATE_PIC", profile_pic: url.signedUrl })
                      : dispatch({ type: "UPDATE_BG_PIC", background_pic: url.signedUrl })
                  ))
                }());
              }
            }

            dispatch({ type: "UPDATE_USERDATA", userData: userprofile });
          }

          if (userRole !== 1337) {
            handleUserOptions("account");
          } else {
            handleUserOptions("profile");
          }
        }
      }
    });
  }, []);

  if (loading) {
    return <Loadingpage />
  } else if (error) {
    return <Loadingpage err={"Settings Fetch Failed: Unable to load settings"} />
  } else {
    return (
      <>
        <div className="useroverviewtitle">
          <i className="material-icons white-text uoverviewicn"> settings </i>
          User Preferences
        </div>
        <div className="useroverview">
          {settingTabs.map((tab: profilesettingtabs, idx: number) => (
            <Htabs
              key={idx}
              tabname={tab}
              handleClick={() => handleUserOptions(tab)}
            />
          ))}
          {userSettingState.isUpdating && (
            <div
              onClick={handleUpdateChanges}
              className="usettingupdatechangesbtn waves-effect waves-light black-text grey lighten-2"
            >
              Apply
            </div>
          )}
        </div>
        <div className="flexy">
          {userSettingState.settingActiveTab === "account" ? (
            <Accounttab
              handleState={dispatch}
              userData={userSettingState.userData}
            />
          ) : userSettingState.settingActiveTab === "profile" ? (
            <Profiletab
              update={update}
              handleState={dispatch}
              handleChange={handleChange}
              settingState={userSettingState}
            />
          ) : userSettingState.settingActiveTab === "privacy" ? (
            <Privacytab
              handleChange={handleChange}
              privacyState={userSettingState.privacyState}
            />
          ) : userSettingState.settingActiveTab === "feeds" ? (
            <Feedtab
              handleChange={handleChange}
              feedsState={userSettingState.feedsState}
            />
          ) : userSettingState.settingActiveTab === "notifications" ? (
            <Notificationtab
              handleChange={handleChange}
              notificationsState={userSettingState.notificationState}
            />
          ) : userSettingState.settingActiveTab === "chat" && (
            <Chattab
              handleState={dispatch}
              chatState={userSettingState.chatState}
            />
          )}
        </div>
        {userSettingState.deleteAcc && (
          <Modal
            btntxt={"Delete"}
            head={"Delete Account"}
            handleUpdate={handleDeleteAcc}
            showModal={userSettingState.deleteAcc}
            txt={"Are you sure, you want to DELETE your account?"}
            handleClose={() => dispatch({ type: "DELETE_ACCOUNT", deleteAcc: false })}
          />
        )}
        {userSettingState.error.message && (
          <Errorcard message={userSettingState.error} />
        )}
      </>
    );
  }
}

export default Profilesetting;