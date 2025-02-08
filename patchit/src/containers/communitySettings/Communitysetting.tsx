import React, { useEffect, useCallback, useReducer } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

//utils
import { useAuth } from "../../utils/hooks/useAuth";
import { changeToThemeColor, communitySettingsInitState, handleCommunitySettingState } from "../../utils/opx/communityopx";

//components
import ProfileTab from "./ProfileTab";
import PrivacyTab from "./PrivacyTab";
import Modal from "../../components/Modal";
import NotificationTab from "./NotificationTab";
import Htabs from "../../components/html/Htabs";
import Errorcard from "../../components/cards/Errorcard";
import Loadingpage from "../../components/Loadingpage";

//queries
import { getSignedUrls } from "../../utils/services/s3";
import { GETCOMMUNITYPREFERENCE, UPSERTCOMMUNITY, UPSERTCOMMUNITYPREFERENCE } from "./queries";

//css & types
import "../css/main.css";
import "../profileSettings/profilesettings.css";
import { authcontexttype } from "../../context/types";
import { USER_S_N_TYPE } from "../../utils/main/types";
import { communitySettingTabs } from "../../constants/const";
import { signedfiletype, signedurltype } from "../../utils/types";
import {
  handlechangetype,
  communitypreferencetype,
  communitysettingtabs,
} from "./types.js";

const Communitysetting = () => {
  const navigate = useNavigate();
  const { cname } = useParams();
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

  //queries
  const [updateCommunity] = useMutation(UPSERTCOMMUNITY);
  const [updateCommunitySettings] = useMutation(UPSERTCOMMUNITYPREFERENCE);
  const [getCommunitySettings, { loading, error }] = useLazyQuery(GETCOMMUNITYPREFERENCE);

  //state
  const [communitySettingState, dispatch] = useReducer(handleCommunitySettingState, communitySettingsInitState);

  //handlers 
  const handleDeleteAcc: () => Promise<void> = async () => {
    try {
      await updateCommunity({
        variables: {
          data: {
            communityname: cname,
            status: "INACTIVE"
          }
        }
      });

      navigate("/home");
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Something went wrong: Community DELETION FAILED",
        }
      });
    }
  }

  const handleChange: handlechangetype = (e: any, statename: communitysettingtabs) => {
    if (statename === "privacy") {
      dispatch({
        type: "UPDATE_PRIVACY_SETTINGS",
        privacySettings: {
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
    }

    dispatch({ type: "SET_UPDATE", update: true });
  }

  const handleUpdateChanges: () => void = async () => {
    try {
      await updateCommunitySettings({
        variables: {
          data: {
            community_name: cname,
            handlers: JSON.stringify([userId, ...communitySettingState?.privacyState.handlers]),
            nsfw: communitySettingState?.privacyState?.nsfw,
            ...communitySettingState?.notificationState,
          }
        },
        onCompleted: () => {
          dispatch({ type: "SET_UPDATE", update: false });
          dispatch({
            type: "SET_ERROR",
            error: {
              show: true,
              status: 200,
              message: "Settings updated successfully",
            }
          });
        }
      })
    } catch (err) {
      dispatch({ type: "RESET" })
      dispatch({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Something went wrong: Settings Update failed",
        }
      });
    }
  }

  const handleUserOptions: (uoption: communitysettingtabs) => void = useCallback((uoption: communitysettingtabs) => {
    document.querySelector(`.tab${communitySettingState?.settingActiveTab}`)?.classList?.remove("selected");

    dispatch({ type: "SET_ACTIVE_TAB", selectedTab: uoption })

    document.querySelector(`.tab${uoption}`)?.classList?.add("selected");
  }, [communitySettingState?.settingActiveTab]);

  useEffect(() => {
    if (!user) {
      navigate("/home");
    } else {
      handleUserOptions("profile");

      getCommunitySettings({
        variables: {
          communityName: cname!
        },
        onCompleted: ({ communitypreference }: { communitypreference: communitypreferencetype }) => {
          if (communitypreference) {
            const csettings: communitypreferencetype = communitypreference;
            const profile_pic: USER_S_N_TYPE = csettings?.community_name?.profile_pic;
            const background_pic: USER_S_N_TYPE = csettings?.community_name?.background_pic;

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
                    userId: csettings?.community_name?.owner.id,
                    postId: "0",
                    req: "GET",
                    files: images
                  });

                  signedUrls.map((url: signedurltype) => {
                    if (url.fileUrl.includes(`${cname}_profile_pic`)) {
                      dispatch({ type: "UPDATE_PIC", profile_pic: url.signedUrl })
                    }

                    if (url.fileUrl.includes(`${cname}_background_pic`)) {
                      dispatch({ type: "UPDATE_BG_PIC", background_pic: url.signedUrl })
                    }
                  })
                }());
              }
            }

            dispatch({
              type: "UPDATE_PRIVACY_SETTINGS",
              privacySettings: {
                nsfw: csettings?.nsfw!,
                handlers: csettings?.handlers.length > 1 ? JSON.parse(csettings?.handlers) : []
              }
            });

            dispatch({
              type: "UPDATE_COMMUNITYDATA",
              communityData: {
                owner: csettings?.community_name.owner.id,
                theme: csettings?.community_name?.theme || "",
                about: csettings?.community_name?.about || "",
                privacy: csettings?.community_name?.privacy,
                profile_pic: csettings?.community_name?.profile_pic,
                background_pic: csettings?.community_name?.background_pic,
                social_links: csettings?.community_name?.social_links,
                description: csettings?.community_name?.description || "",
              }
            });

            dispatch({
              type: "UPDATE_NOTIFICATION_SETTINGS",
              notifySettings: {
                birthday: csettings?.birthday!,
                newuserreq: csettings?.newuserreq!,
                reportonpost: csettings?.reportonpost!,
                reportoncmnt: csettings?.reportoncmnt!,
                reportonuser: csettings?.reportonuser!,
                activityincommunity: csettings?.activityincommunity!,
              }
            });
          }
        }
      })
    }
  }, []);

  useEffect(() => {
    if (communitySettingState?.communityData.theme) {
      changeToThemeColor(communitySettingState?.communityData.theme);
    }
  }, [communitySettingState?.communityData.theme, handleUserOptions]);

  if (loading) {
    return <Loadingpage />
  } else if (error) {
    return <Loadingpage err={"Unable to load community settings: Not authorised"} />
  } else {
    return (
      <>
        <div className="useroverviewtitle">
          <i className="material-icons white-text uoverviewicn"> settings </i>
          Community Preferences
        </div>
        <div className="useroverview">
          {communitySettingTabs.map((tab: communitysettingtabs, idx: number) => (
            <Htabs
              key={idx}
              tabname={tab}
              handleClick={() => handleUserOptions(tab)}
            />
          ))}
          {communitySettingState?.isUpdating && (
            <>
              <div
                onClick={handleUpdateChanges}
                className={`usettingupdatechangesbtn waves-effect waves-light black-text ${communitySettingState.communityData.theme && "themebg"}`
                }
              >
                Apply
              </div>
            </>
          )}
        </div>
        <div className="flexy">
          {communitySettingState?.settingActiveTab === "profile" ? (
            <ProfileTab
              cname={cname!}
              handleState={dispatch}
              communityState={{
                data: communitySettingState?.communityData,
                show_profile_pic: communitySettingState?.display_profile_pic,
                show_background_pic: communitySettingState?.display_background_pic
              }}
            />
          ) : communitySettingState?.settingActiveTab === "privacy" ? (
            <PrivacyTab
              handleChange={handleChange}
              privacyState={communitySettingState?.privacyState}
            />
          ) : communitySettingState?.settingActiveTab === "notifications" && (
            <NotificationTab
              handleChange={handleChange}
              notificationsState={communitySettingState?.notificationState}
            />
          )}
        </div>
        {communitySettingState?.deleteCommunity && (
          <Modal
            btntxt={"Delete"}
            head={"Delete Community"}
            handleUpdate={handleDeleteAcc}
            txt={"Are you sure, you want to DELETE community?"}
            showModal={communitySettingState?.deleteCommunity}
            handleClose={() => dispatch({ type: "DELETE_ACCOUNT", deleteAcc: false })}
          />
        )}
        {communitySettingState?.error.message && (
          <Errorcard message={communitySettingState?.error} />
        )}
      </>
    );
  }
}

export default Communitysetting;