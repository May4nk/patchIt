import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useLogged } from "../../common/hooks/useAuth";
//components
import Chattab from "./Chattab";
import Feedtab from "./Feedtab";
import Privacytab from "./Privacytab";
import Accounttab from "./Accounttab";
import Profiletab from "./Profiletab";
import Notificationtab from "./Notificationtab";
import Htabs from "../../components/html/Htabs";
import Modalcomponent from "../../components/Modalcomponent";
//queries
import { GETUSERPREFERENCE, UPSERTUSERPREFERENCES } from "../queries/profilesetting";
//css & types
import "../css/main.css";
import "./profilesettings.css";
import { settingTabs } from "../../constants/const";
import { authcontexttype, loggedusercontexttype } from "../../context/types";
import {
  profilestatetype,
  feedsstatetype,
  notificationsstatetype,
  privacystatetype,
  chatstatetype,
  userdatatype,
  modalstatetype,
  userprofilestate,
} from "./profilesettingtypes.js"

const Profilesetting = () => {
  const navigate = useNavigate();
  const { uname } = useParams();
  const { user }: authcontexttype = useAuth();
  const { loggedUser }: loggedusercontexttype = useLogged();
  const userId: number | null = user && (user["user_id"] | user["id"]);
  const username: string | null = user && (user["username"]);
  const usettings: loggedusercontexttype["loggedUser"] = user && loggedUser;
  //queries
  const [getUserSettings] = useLazyQuery(GETUSERPREFERENCE);
  const [updateUserSettings] = useMutation(UPSERTUSERPREFERENCES);
  //states
  const [show, setShow] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [userOption, setUserOption] = useState<string>("account");
  const [chatState, setChatState] = useState<chatstatetype>({ sendmsg: "" });
  const [feedsState, setFeedState] = useState<feedsstatetype>({ show_nsfw: false });
  const [modalState, setModalState] = useState<modalstatetype>({
    txt: "",
    btntxt: "",
    placeholder: "",
    toUpdate: ""
  });
  const [userData, setUserData] = useState<userdatatype>({
    email: "",
    username: "",
    status: "",
    about: "",
    profile_pic: "",
    background_pic: ""
  });
  const [profileState, setProfileState] = useState<profilestatetype>({
    nsfw: false,
    allowppltofollow: false,
    contentvisiblity: false,
  });
  const [notificationsState, setNotificationState] = useState<notificationsstatetype>({
    chatreq: false,
    mentionusername: false,
    activityonpost: false,
    activityoncmnt: false,
    activityonpostfollowed: false,
    patcoinreceived: false,
    communityfollowed: false,
    birthday: false,
    announcements: false,
  });
  const [privacyState, setPrivacyState] = useState<privacystatetype>({
    auth_twofactor: false,
    searchshowprofile: false,
    blocked: [],
  });
  //handlers
  const handleChange: (e: any, statename: string) => void = (e: any, statename: string) => {
    setUpdateState(true);
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
    }
  }

  const handleModalState: (mstate: modalstatetype) => void = (mstate: modalstatetype) => {
    setShow(true);
    setModalState({
      ...modalState,
      ...mstate,
    })
  }

  const handleUpdateChanges: () => void = () => {
    updateUserSettings({
      variables: {
        data: {
          user_id: userId,
          ...privacyState,
          blocked: JSON.stringify(privacyState.blocked),
          ...notificationsState,
          ...feedsState,
          ...profileState
        }
      }
    }).then(() => {
      setUpdateState(false);
    })
  }

  const handleUserOptions: (uoption: string) => void = (uoption) => {
    document.querySelector(`.tab${userOption}`)?.classList?.remove("selected");
    setUserOption(uoption);
    document.querySelector(`.tab${uoption}`)?.classList?.add("selected");
  }

  useEffect(() => {
    getUserSettings({
      variables: {
        userId: userId!
      }
    }).then(({ data }: { data: { userpreference: { id: number, user_id: userprofilestate } } }) => {
      if (data) {
        const userprofile: userprofilestate = data?.userpreference?.user_id;
        if (userprofile) {
          setUserData({
            email: userprofile?.email,
            username: userprofile?.username,
            status: userprofile?.status,
            about: userprofile?.about,
            profile_pic: userprofile?.profile_pic,
            background_pic: userprofile?.background_pic,
          })
        }
      }
    })
  }, []);

  useEffect(() => {
    if (usettings) {
      setChatState({ sendmsg: usettings?.sendmsg! });
      setFeedState({ show_nsfw: usettings?.show_nsfw! });
      setPrivacyState({
        auth_twofactor: usettings?.auth_twofactor!,
        searchshowprofile: usettings?.searchshowprofile!,
        blocked: usettings?.blocked ? JSON.parse(usettings?.blocked) : usettings?.blocked,
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
  }, [usettings])

  useEffect(() => {
    if (!user || username !== uname) {
      navigate("/home");
    } else {
      handleUserOptions("account");
    }
  }, [username, user, uname]);

  return (
    <>
      <div className="useroverviewtitle">
        <i className="material-icons white-text uoverviewicn"> settings </i>
        User Preferences
      </div>
      <div className="useroverview">
        {settingTabs.map((tab: string, idx: number) => (
          <Htabs
            tabname={tab}
            handleClick={() => handleUserOptions(tab)}
            key={idx}
          />
        ))}
        {updateState && (
          <div className="usettingupdatechangesbtn waves-effect waves-light black-text grey"
            onClick={handleUpdateChanges}
          >
            Update
          </div>
        )}
        <Modalcomponent
          showModal={show}
          btntxt={modalState.btntxt}
          setShowModal={setShow}
          txt={modalState.txt}
          toUpdate={modalState.toUpdate}
          placeholder={modalState.placeholder}
          setUserData={setUserData}
          userData={userData}
        />
      </div>
      <div className="flexy">
        {userOption === "account" ? (
          <Accounttab
            userData={userData}
            handleModalState={handleModalState}
          />
        ) : userOption === "profile" ? (
          <Profiletab
            profileState={profileState}
            handleChange={handleChange}
            handleModalState={handleModalState}
            userData={userData}
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
    </>
  );
}

export default Profilesetting;