import React, { useState, useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { changeToBase64 } from "../../utils/opx";
import { useAuth, useLogged } from "../../utils/hooks/useAuth";

//components
import Chattab from "./Chattab";
import Feedtab from "./Feedtab";
import Privacytab from "./Privacytab";
import Accounttab from "./Accounttab";
import Profiletab from "./Profiletab";
import Modal from "../../components/Modal";
import Notificationtab from "./Notificationtab";
import Htabs from "../../components/html/Htabs";
import Errorcard from "../../components/cards/Errorcard";

//queries
import { UPDATEUSER } from "../../utils/loginqueries";
import { GETUSERPREFERENCE, UPSERTUSERPREFERENCES } from "./queries";

//css & types
import "../css/main.css";
import "./profilesettings.css";
import { ERRORTYPE } from "../../utils/main/types";
import { settingTabs } from "../../constants/const";
import { authcontexttype, loggedusercontexttype } from "../../context/types";
import {
  profilestatetype,
  feedsstatetype,
  notificationsstatetype,
  privacystatetype,
  chatstatetype,
  userdatatype,
  userprofilestate,
  profilesettingtabs,
  handleupdatetype,
  handleuserupdatetype,
} from "./types.js"

const Profilesetting = () => {
  const navigate = useNavigate();
  const { uname } = useParams();
  const profileRef = useRef<HTMLInputElement | null>(null);
  const wallpicRef = useRef<HTMLInputElement | null>(null);

  const { user, logout }: authcontexttype = useAuth();
  const { loggedUser }: loggedusercontexttype = useLogged();
  const userId: number | null = user && Number(user["id"]);
  const username: string | null = user && (user["username"]);
  const usettings: loggedusercontexttype["loggedUser"] = user && loggedUser;

  //queries
  const [updateUser] = useMutation(UPDATEUSER);
  const [getUserSettings] = useLazyQuery(GETUSERPREFERENCE);
  const [updateUserSettings] = useMutation(UPSERTUSERPREFERENCES);

  //states
  const [message, setMessage] = useState<ERRORTYPE>({ status: 0, message: "", show: false });
  const [deactivateAcc, setDeactivateAcc] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [userOption, setUserOption] = useState<profilesettingtabs>("account");
  const [chatState, setChatState] = useState<chatstatetype>({ sendmsg: "" });
  const [feedsState, setFeedState] = useState<feedsstatetype>({ show_nsfw: false });
  const [userData, setUserData] = useState<userdatatype>({
    email: "",
    about: "",
    username: "",
    privacy: "PUBLIC",
    profile_pic: "",
    background_pic: "",
    social_links: ""
  });
  const [profileState, setProfileState] = useState<profilestatetype>({
    nsfw: false,
    allowppltofollow: false,
    contentvisiblity: false,
  });
  const [notificationsState, setNotificationState] = useState<notificationsstatetype>({
    chatreq: false,
    birthday: false,
    announcements: false,
    activityonpost: false,
    activityoncmnt: false,
    patcoinreceived: false,
    mentionusername: false,
    communityfollowed: false,
    activityonpostfollowed: false,
  });
  const [privacyState, setPrivacyState] = useState<privacystatetype>({
    blocked: "",
    auth_twofactor: false,
    searchshowprofile: false,
  });

  //handlers
  const handleChange: (e: any, statename: string) => void = (e: any, statename: string) => {
    if (statename === "profile") {
      setProfileState({
        ...profileState,
        [e.target.name]: e.target.checked
      });
    } else if (statename === "feeds") {
      setFeedState({
        ...feedsState,
        [e.target.name]: e.target.checked
      });
    } else if (statename === "notifications") {
      setNotificationState({
        ...notificationsState,
        [e.target.name]: e.target.checked
      });
    } else if (statename === "privacy") {
      setPrivacyState({
        ...privacyState,
        [e.target.name]: e.target.checked
      });
    };
    setUpdateState(true);
  };

  const update: handleupdatetype = async (toUpdate: string, value: string) => {
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

  const handleUserUpdate: handleuserupdatetype = async (toUpdate: string, val?: string) => {
    try {
      if (!userId) return;

      if (toUpdate === "profile_pic" || toUpdate === "background_pic") {
        const profileFiles = profileRef?.current?.files;
        const wallpicFiles = wallpicRef?.current?.files;

        const picBlob = (profileFiles && profileFiles.length > 0 ? profileFiles[0] : null) ||
          (wallpicFiles && wallpicFiles.length > 0 ? wallpicFiles[0] : null);

        if (picBlob) {
          const pic = await changeToBase64(picBlob);
          setUserData({ ...userData, [toUpdate]: pic });

          try {
            const msg = await update(toUpdate, pic);
            setMessage({ status: 200, message: msg, show: true });
          } catch (err) {
            setMessage({
              show: true,
              status: 500,
              message: "Something went wrong: Pic update failed",
            });
          }
        }
      } else {
        const msg = await update(toUpdate, val ? val : userData[toUpdate]);
        setMessage({ status: 200, message: msg, show: true });
      }
    } catch (err) {
      setMessage({
        show: true,
        status: 500,
        message: "Something went wrong: User update failed",
      });
    }
  };

  const handleDeleteAcc: () => Promise<void> = async () => {
    try {
      await update("status", "INACTIVE");
      setDeactivateAcc(false);
      logout();
    } catch (err) {
      setDeactivateAcc(false);
      setMessage({
        show: true,
        status: 500,
        message: "Something went wrong DELETING your account. Try again later",
      });
    }
  };

  const handleUpdateChanges: () => Promise<void> = async () => {
    try {
      await updateUserSettings({
        variables: {
          data: {
            user_id: userId,
            ...privacyState,
            ...notificationsState,
            ...feedsState,
            ...profileState,
            blocked: JSON.stringify(privacyState.blocked),
          }
        },
        onCompleted: () => {
          setMessage({
            status: 200,
            show: true,
            message: "User Settings updated",
          });
          setUpdateState(false);
        }
      })
    } catch (err) {
      setMessage({
        status: 500,
        show: true,
        message: "Something went wrong: Settings update failed",
      });
    }
  }

  const handleUserOptions: (uoption: profilesettingtabs) => void = (uoption: profilesettingtabs) => {
    document.querySelector(`.tab${userOption}`)?.classList?.remove("selected");
    setUserOption(uoption);
    document.querySelector(`.tab${uoption}`)?.classList?.add("selected");
  }

  useEffect(() => {
    if (!user || username !== uname) {
      navigate("/home");
      return;
    }

    handleUserOptions("account");
    getUserSettings({
      variables: {
        userId: userId!
      },
      onCompleted: ({ userpreference }: { userpreference: { user_id: userprofilestate } }) => {
        if (userpreference.user_id) {
          const userprofile: userprofilestate = userpreference?.user_id;
          if (userprofile) {
            setUserData(userprofile);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (usettings) {
      setChatState({ sendmsg: usettings?.sendmsg! });
      setFeedState({ show_nsfw: usettings?.show_nsfw! });
      setPrivacyState({
        blocked: usettings.blocked!,
        auth_twofactor: usettings?.auth_twofactor!,
        searchshowprofile: usettings?.searchshowprofile!,
      });
      setProfileState({
        nsfw: usettings?.nsfw!,
        allowppltofollow: usettings?.allowppltofollow!,
        contentvisiblity: usettings?.contentvisiblity!,
      });
      setNotificationState({
        chatreq: usettings?.chatreq!,
        mentionusername: usettings?.mentionusername!,
        activityonpost: usettings?.activityonpost!,
        activityoncmnt: usettings?.activityoncmnt!,
        activityonpostfollowed: usettings?.activityonpostfollowed!,
        patcoinreceived: usettings?.patcoinreceived!,
        communityfollowed: usettings?.communityfollowed!,
        birthday: usettings?.birthday!,
        announcements: usettings?.announcements!,
      });
    }
  }, [usettings]);

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
        {updateState && (
          <div
            onClick={handleUpdateChanges}
            className="usettingupdatechangesbtn waves-effect waves-light black-text grey lighten-2"
          >
            Apply
          </div>
        )}
      </div>
      <div className="flexy">
        {userOption === "account" ? (
          <Accounttab
            userData={userData}
            handleUpdate={update}
            setMessage={setMessage}
            setUserData={setUserData}
            setDeactivateAcc={setDeactivateAcc}
          />
        ) : userOption === "profile" ? (
          <Profiletab
            userData={userData}
            profileRef={profileRef}
            wallpicRef={wallpicRef}
            setUserData={setUserData}
            profileState={profileState}
            handleChange={handleChange}
            handleUserUpdate={handleUserUpdate}
          />
        ) : userOption === "privacy" ? (
          <Privacytab
            handleChange={handleChange}
            privacyState={privacyState}
          />
        ) : userOption === "feeds" ? (
          <Feedtab
            feedsState={feedsState}
            handleChange={handleChange}
          />
        ) : userOption === "notifications" ? (
          <Notificationtab
            handleChange={handleChange}
            notificationsState={notificationsState}
          />
        ) : userOption === "chat" && (
          <Chattab
            chatState={chatState}
            setChatState={setChatState}
          />
        )}
      </div>
      {deactivateAcc && (
        <Modal
          btntxt={"Delete"}
          head={"Delete Account"}
          txt={"Are you sure, you want to DELETE your account?"}
          showModal={deactivateAcc}
          handleUpdate={handleDeleteAcc}
          handleClose={() => setDeactivateAcc(false)}
        />
      )}
      {message && (
        <Errorcard message={message} />
      )}
    </>
  );
}

export default Profilesetting;