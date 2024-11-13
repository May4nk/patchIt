import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../utils/hooks/useAuth";
import { changeToThemeColor } from "../../utils/themeopx";

//coomponents
import ProfileTab from "./ProfileTab";
import PrivacyTab from "./PrivacyTab";
import Modal from "../../components/Modal";
import NotificationTab from "./NotificationTab";
import Htabs from "../../components/html/Htabs";
import Errorcard from "../../components/cards/Errorcard";
import Loadingpage from "../../components/Loadingpage";

//queries
import { GETCOMMUNITYPREFERENCE, UPSERTCOMMUNITY, UPSERTCOMMUNITYPREFERENCE } from "./queries";

//css & types
import "../css/main.css";
import "../profileSettings/profilesettings.css";
import { authcontexttype } from "../../context/types";
import { communitySettingTabs } from "../../constants/const";
import {
  notificationsstatetype,
  communitystatetype,
  handlechangetype,
  communitypreferencetype,
  statenametype,
  privacystatetype,
} from "./types.js";
import { ERRORTYPE } from "../../utils/main/types";

const Communitysetting = () => {
  const navigate = useNavigate();
  const { cname } = useParams();
  const { user }: authcontexttype = useAuth();

  const userId: number | null = user && user["id"];

  //queries
  const [updateCommunity] = useMutation(UPSERTCOMMUNITY);
  const [updateCommunitySettings] = useMutation(UPSERTCOMMUNITYPREFERENCE);
  const [getCommunitySettings, { loading, error }] = useLazyQuery(GETCOMMUNITYPREFERENCE);

  //states  
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [userOption, setUserOption] = useState<statenametype>("profile");
  const [deleteCommunity, setDeleteCommunity] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ERRORTYPE>({ status: 0, message: "", show: false });
  const [privacyState, setPrivacyState] = useState<privacystatetype>({
    nsfw: false,
    handlers: []
  });
  const [communityState, setCommunityState] = useState<communitystatetype>({
    theme: "",
    about: "",
    privacy: "PUBLIC",
    profile_pic: "",
    description: "",
    social_links: "",
    background_pic: "",
  });
  const [notificationsState, setNotificationState] = useState<notificationsstatetype>({
    birthday: false,
    newuserreq: false,
    reportonpost: false,
    reportoncmnt: false,
    reportonuser: false,
    activityincommunity: false,
  });

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
      setErrorMessage({
        status: 500,
        show: true,
        message: "Something went wrong: Community DELETION FAILED",
      });
    }
  }

  const handleChange: handlechangetype = (e: any, statename: statenametype) => {
    setUpdateState(true);
    if (statename === "profile") {
      setPrivacyState({
        ...privacyState,
        [e.target.name]: e.target.checked
      });
    } else if (statename === "notifications") {
      setNotificationState({
        ...notificationsState,
        [e.target.name]: e.target.checked
      });
    }
  }

  const handleUpdateChanges: () => void = async () => {
    try {
      await updateCommunitySettings({
        variables: {
          data: {
            community_name: cname,
            handlers: JSON.stringify([userId, ...privacyState.handlers]),
            nsfw: privacyState?.nsfw,
            ...notificationsState,
          }
        },
        onCompleted: () => {
          setUpdateState(false);
          setErrorMessage({
            status: 200,
            show: true,
            message: "Settings updated successfully",
          });
        }
      })
    } catch (err) {
      setPrivacyState((prev) => ({ ...prev }));
      setNotificationState((prev) => ({ ...prev }));

      setErrorMessage({
        status: 500,
        show: true,
        message: "Something went wrong: Settings Update failed",
      });
    }
  }

  const handleUserOptions: (uoption: statenametype) => void = useCallback((uoption: statenametype) => {
    document.querySelector(`.tab${userOption}`)?.classList?.remove("selected");
    setUserOption(uoption);
    document.querySelector(`.tab${uoption}`)?.classList?.add("selected");
  }, [userOption]);

  useEffect(() => {
    if (!user) {
      navigate("/home");
    } else {
      getCommunitySettings({
        variables: {
          communityName: cname!
        },
        onCompleted: ({ communitypreference }: { communitypreference: communitypreferencetype }) => {
          if (communitypreference) {
            const csettings: communitypreferencetype = communitypreference;

            handleUserOptions("profile");

            setPrivacyState({
              nsfw: csettings?.nsfw!,
              handlers: csettings?.handlers.length > 1 ? JSON.parse(csettings?.handlers) : []
            });

            setCommunityState({
              theme: csettings?.community_name?.theme || "",
              about: csettings?.community_name?.about || "",
              privacy: csettings?.community_name?.privacy,
              description: csettings?.community_name?.description || "",
              profile_pic: csettings?.community_name?.profile_pic,
              social_links: csettings?.community_name?.social_links,
              background_pic: csettings?.community_name?.background_pic,
            });

            setNotificationState({
              birthday: csettings?.birthday!,
              newuserreq: csettings?.newuserreq!,
              reportonpost: csettings?.reportonpost!,
              reportoncmnt: csettings?.reportoncmnt!,
              reportonuser: csettings?.reportonuser!,
              activityincommunity: csettings?.activityincommunity!,
            });
          }
        }
      })
    }
  }, []);

  useEffect(() => {
    if (communityState.theme) {
      changeToThemeColor(communityState.theme);
    }
  }, [communityState?.theme, handleUserOptions]);

  if (loading) {
    return <Loadingpage />
  } else if (error) {
    return <Loadingpage err={error?.message} />
  } else {
    return (
      <>
        <div className="useroverviewtitle">
          <i className="material-icons white-text uoverviewicn"> settings </i>
          Community Preferences
        </div>
        <div className="useroverview">
          {communitySettingTabs.map((tab: statenametype, idx: number) => (
            <Htabs
              key={idx}
              tabname={tab}
              handleClick={() => handleUserOptions(tab)}
            />
          ))}
          {updateState && (
            <>
              <div
                onClick={handleUpdateChanges}
                className="usettingupdatechangesbtn waves-effect waves-light black-text themebg"
              >
                Apply
              </div>
            </>
          )}
        </div>
        <div className="flexy">
          {userOption === "profile" ? (
            <ProfileTab
              cname={cname!}
              setErrorMessage={setErrorMessage}
              communityState={communityState}
              setCommunityState={setCommunityState}
              setDeleteCommunity={setDeleteCommunity}
            />
          ) : userOption === "privacy" ? (
            <PrivacyTab
              privacyState={privacyState}
              handleChange={handleChange}
              setPrivacyState={setPrivacyState}
            />
          ) : userOption === "notifications" && (
            <NotificationTab
              notificationsState={notificationsState}
              handleChange={handleChange}
            />
          )}
        </div>
        {deleteCommunity && (
          <Modal
            btntxt={"Delete"}
            head={"Delete Community"}
            txt={"Are you sure, you want to DELETE community?"}
            showModal={deleteCommunity}
            handleUpdate={handleDeleteAcc}
            handleClose={() => setDeleteCommunity(false)}
          />
        )}
        {errorMessage.message && (
          <Errorcard message={errorMessage} />
        )}
      </>
    );
  }
}

export default Communitysetting;