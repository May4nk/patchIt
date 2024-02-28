import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useLogged } from "../common/hooks/useAuth";

import Htabs from "../components/html/Htabs";
import Patdrop from "../components/html/patdrop/Patdrop";
import Modalcomponent from "../components/Modalcomponent";

//queries
import { GETUSERPREFERENCE, UPSERTUSERPREFERENCES } from "./queries/profilesetting"; 

//css & types
import "./css/main.css";
import "./css/profilesettings.css";
import { settingTabs } from "../constants/const";
import { authcontexttype } from "../context/types";
import { droppertype, profiletype } from "../components/html/patdrop/types.js";
import {
  profilestatetype,
  feedsstatetype,
  notificationsstatetype,
  privacystatetype,
  chatstatetype,
  userdatatype,
  modalstatetype,  
} from "./types/profilesettingtypes.js";

const Profilesetting = () => {
  const navigate = useNavigate();
  const { uname } = useParams();
  const { user }: authcontexttype = useAuth();
  const { loggedUser } = useLogged();
  const userId: number | null = user && (user["user_id"] | user["id"]);
  const username: string | null = user && (user["username"]);

  const usettings = user && loggedUser;

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
    searchshowprofile: false
  });

  //handler
  const handleChange: (e: any, statename: string) => void = (e, statename) => {
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

  const privacyDropperprofile: profiletype = {
    icn: "lock",
    title: "Privacy",    
  };

  const privacyDroppers: droppertype[] = [
    {
      value: "anyone", icn: "person_outline",
      state: "clicked", event: () => setChatState({ ...chatState, sendmsg: "ANYONE" })
    },
    {
      value: "none", icn: "lock_outline",
      state: "clicked", event: () => setChatState({ ...chatState, sendmsg: "NONE" })
    },
    {
      value: "followers", icn: "no_encryption",
      state: "clicked", event: () => setChatState({ ...chatState, sendmsg: "FOLLOWERS" })
    }
  ];

  useEffect(() => {
    getUserSettings({
      variables: {
        userId: userId!
      }
    }).then(({ data }: any) => {
      if(data) {
        const usettings = data?.userpreference;
        if(usettings) {
          setUserData({
            email: usettings?.user_id?.email,
            username: usettings?.user_id?.username,
            status: usettings?.user_id?.status,
            about: usettings?.user_id?.about,
            profile_pic: usettings?.user_id?.profile_pic,
            background_pic: usettings?.user_id?.background_pic,
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

  let pic: string = require("../img/a.jpg");

  return (
    <>
      <div className="useroverviewtitle">
        <i className="material-icons white-text uoverviewicn"> settings </i>
        User Preferences
      </div>
      <div className="useroverview">
        { settingTabs.map((tab: string, idx: number) => (
          <Htabs
            tabname={ tab }
            handleClick={ () => handleUserOptions(tab) }
            key={ idx }
          />
        ))}
        { updateState && (
          <div className="usettingupdatechangesbtn waves-effect waves-light black-text grey" onClick={ handleUpdateChanges }>
            Update
          </div>
        )}
        <Modalcomponent
          showModal={ show }
          btntxt={ modalState.btntxt }
          setShowModal={ setShow }
          txt={ modalState.txt }
          toUpdate={ modalState.toUpdate }
          placeholder={ modalState.placeholder }
          setUserData={ setUserData }
          userData={ userData }
        />
      </div>
      <div className="flexy">
        {userOption === "account" ? (
          <div className="usetting">
            <div className="usettingtitle"> Account settings </div>
            <div className="usettingtitlemeta"> ACCOUNT PREFERENCES </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Email address </div>
                <div className="usettingitemmetatitle">
                  { userData.email }
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light black-text blue usettingitembtn" 
                  onClick={() => {
                    handleModalState({ 
                      txt: "Update your Email Address",
                      btntxt: "update",
                      placeholder: "Email Address",
                      toUpdate: "email"
                    })
                  }}
                >
                  Update
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Change password </div>
                <div className="usettingitemmetatitle"> Password must be at least 8 characters long </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light black-text blue usettingitembtn">
                  Update
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Deactivate account </div>
                <div className="usettingitemmetatitle">{ userData.username }</div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light black-text red usettingitembtn" 
                  onClick={() => handleModalState({
                    txt: "Please enter 'delete/' followed by your username to confirm.",
                    btntxt: "deactivate",
                    placeholder: `delete/${username}`,
                    toUpdate: "status"
                  })}
                >
                  deactivate
                </div>
              </div>
            </div>
          </div>
        ) : userOption === "profile" ? (
          <div className="usetting">
            <div className="usettingtitle"> Customize profile </div>
            <div className="usettingtitlemeta"> PROFILE INFO </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Background Pic </div>
                <div className="usettingitemmetatitle"> Your Profile wall pic. </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light wallpicwrapper">
                  <img className="wallpic" src={pic} alt="wall_pic" />
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Profile Pic </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light picwrapper">
                  <img className="pic" src={ pic } alt="profile_pic" />
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> About </div>
                <div className="usettingitemmetatitle"> 
                  { userData.about || "A brief description of yourself shown on your profile." } 
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light black-text blue usettingitembtn"
                  onClick={() => {
                    handleModalState({
                      txt: "Tell us about yourself.",
                      btntxt: "update",
                      placeholder: "About",
                      toUpdate: "about"
                    })
                  }}
                >
                  Update
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Social links </div>
                <div className="usettingitemmetatitle">
                  People who visit your profile will see your social links. 
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light black-text blue usettingitembtn">
                  Update
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> PROFILE CATEGORY </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> NSFW (Not Safe For Work)</div>
                <div className="usettingitemmetatitle">
                  This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18).
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input
                      type="checkbox"
                      className="blue-text"
                      name="nsfw"
                      checked={ profileState.nsfw }
                      onChange={ (e: any) => handleChange(e, "profile") }
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> ADVANCED </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Allow people to follow you </div>
                <div className="usettingitemmetatitle">
                  Followers will be notified about posts you make to your profile and see them in their home feed.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="allowppltofollow"
                      checked={ profileState.allowppltofollow }
                      onChange={ (e: any) => handleChange(e, "profile") }
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Content Visibility </div>
                <div className="usettingitemmetatitle">
                  Posts to this profile can appear in c/popular or home feed of users who are following you.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="contentvisiblity"
                      checked={ profileState.contentvisiblity }
                      onChange={ (e: any) => handleChange(e, "profile") }
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : userOption === "privacy" ? (
          <div className="usetting">
            <div className="usettingtitle"> Manage Privacy </div>
            <div className="usettingtitlemeta"> Safety </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> People you've blocked</div>
                <div className="usettingitemmetatitle">
                  Blocked people can’t send you chat requests or private messages.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light black-text blue usettingitembtn">
                  Update
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Communities you've muted </div>
                <div className="usettingitemmetatitle">
                  Posts from muted communities won't show up in your feeds or recommendations.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light black-text blue usettingitembtn">
                  Change
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> privacy </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Show up in search result </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input
                      type="checkbox"
                      className="blue-text"
                      checked={ privacyState.searchshowprofile }
                      name="searchshowprofile"
                      onChange={ (e: any) => handleChange(e, "privacy") }
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> advanced security </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Use two-factor authentication </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="auth_twofactor"
                      checked={ privacyState.auth_twofactor }
                      onChange={ (e: any) => handleChange(e, "privacy") }
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : userOption === "feeds" ? (
          <div className="usetting">
            <div className="usettingtitle"> Feeds Settings </div>
            <div className="usettingtitlemeta"> Content Preferences </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Adult Content </div>
                <div className="usettingitemmetatitle">
                 Enable to view adult and NSFW (not safe for work) content in your feed and search results.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input
                      type="checkbox"
                      className="blue-text"
                      name="show_nsfw"
                      checked={feedsState.show_nsfw}
                      onChange={(e: any) => handleChange(e, "feeds")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : userOption === "notifications" ? (
          <div className="usetting">
            <div className="usettingtitle"> Notification Preferences </div>
            <div className="usettingtitlemeta"> Messages </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Chat requests </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="chatreq"
                      checked={notificationsState.chatreq}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> Activity </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Mention of u/username </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input
                      type="checkbox"
                      className="blue-text"
                      name="mentionusername"
                      checked={notificationsState.mentionusername}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Activity on your posts </div>
                <div className="usettingitemmetatitle"> 
                  Any activity (upvotes, downvotes, comments) on your done post.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="activityonpost"
                      checked={notificationsState.activityonpost}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Activity on your comment </div>
                <div className="usettingitemmetatitle">
                  Any activity (upvotes, replies) on your done comment.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="activityoncmnt"
                      checked={notificationsState.activityoncmnt}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Activity on your followed post </div>
                <div className="usettingitemmetatitle">
                 Any activity (upvotes, downvotes, comments) on your followed post.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="activityonpostfollowed"
                      checked={notificationsState.activityonpostfollowed}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Activity on your followed community </div>
                <div className="usettingitemmetatitle">
                  Any activity (new posts, new rules, new pinned posts, new announcements) in your followed community.
                </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="communityfollowed"
                      checked={notificationsState.communityfollowed}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Patcoins you receive </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="patcoinreceived"
                      checked={notificationsState.patcoinreceived}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> Updates </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Birthday </div>
                <div className="usettingitemmetatitle"> Any follower or community birth/created date. </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="birthday"
                      checked={notificationsState.birthday}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Patch announcements </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input 
                      type="checkbox"
                      className="blue-text"
                      name="announcements"
                      checked={notificationsState.announcements}
                      onChange={(e: any) => handleChange(e, "notifications")}
                    />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : userOption === "chat" && (
          <div className="usetting">
            <div className="usettingtitle"> Chat Preferences </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Who can send you chat request </div>
              </div>
              <div className="usettingitemdrop">
                <Patdrop profile={privacyDropperprofile} droppers={privacyDroppers} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profilesetting;