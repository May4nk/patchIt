import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import { useAuth, useLogged } from "../../utils/hooks/useAuth";

//components
import Patcoindrop from "./Patcoindrop";
import Chatbox from "../chatbox/Chatbox";
import Loginbox from "../login/Loginbox";
import Patdrop from "../html/patdrop/Patdrop";
import Searchbox from "../searchbox/Searchbox";
import CreateCommunity from "./Createcommunity";
import Notificationdrop from "./Notificationdrop";

//queries
import { GETUSERCOMMUNITIES } from "./queries";
import { UPDATEUSER } from "../../utils/loginqueries";

//css & constants & types
import "./css/navbar.css";
import { newnotificationtiptype, usercommunitytype } from "./types";
import { droppertype, profiletype } from "../html/patdrop/types";
import { navigationDropperprofile } from "../../constants/patdropconst";
import { defaultCommunityPic, defaultUserPic } from "../../constants/const";
import { authcontexttype, loggedusercontexttype } from "../../context/types";

const logo: string = require("../../img/navbar_logo.png");

const Navbar = () => {
  const { cname } = useParams<string>();
  const { logout, user }: authcontexttype = useAuth();

  const { loggedUser }: loggedusercontexttype = useLogged();
  const userRole: number | null = user && user?.role;
  const userId: number | null = user && Number(user["id"]);
  const loggedInUsername: string | null = user && user["username"];
  const profile_pic: string | null = loggedUser?.profile_pic || null;

  //states
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSearchbox, setShowSearchbox] = useState<boolean>(false);
  const [createCommunity, setCreateCommunity] = useState<boolean>(false);
  const [showPatcoindrop, setShowpatcoindrop] = useState<boolean>(false);
  const [showNotificationdrop, setShowNotificationdrop] = useState<boolean>(false);
  const [newNotificationTip, setNewNotificationTip] = useState<newnotificationtiptype>({
    chat: false,
    notification: false
  });

  //queries
  const [updateUser] = useMutation(UPDATEUSER);
  const [getUserCommunities, { data, loading }] = useLazyQuery(GETUSERCOMMUNITIES);

  //constants 
  const profileDropperprofile: profiletype = useMemo(() => ({
    img: profile_pic || defaultUserPic,
    state: "DEFAULT",
    title: loggedInUsername!,
    meta: { icn: "blur_on", title: `0 patcoin` },
  }), [profile_pic, loggedInUsername]);

  const profileDroppers: droppertype[] = [
    { title: loggedInUsername!, icn: "perm_identity", text: true },
    { title: "Profile", state: "LINKED", link: `/u/${loggedInUsername}` },
    { title: "Settings", state: "LINKED", link: `/u/${loggedInUsername}/settings/profile` },
    { title: "Unlocked", icn: "lock_open", text: true },
    { last: true, title: "Patcoins", state: "LINKED", link: `/u/${loggedInUsername}`, icn: "blur_on" },
    { last: true, title: "Create Community", event: () => setCreateCommunity(true), icn: "people_outline" },
    { title: "logout", icn: "power_settings_new", event: () => handleLogout() }
  ];

  const navigationDroppers: droppertype[] = [
    { title: "Home", icn: "home", state: "LINKED", link: "/home" },
    { title: "Popular", icn: "whatshot", state: "LINKED", link: "/c/popular" },
    ...(!loading && user && data?.listUsersCommunity?.length > 0)
      ? [{ title: "Communities", text: true },
      ...data?.listUsersCommunity.map((usercommunity: usercommunitytype) => (
        {
          state: "LINKED",
          title: usercommunity.community_id.communityname,
          img: usercommunity.community_id.profile_pic || defaultCommunityPic,
          link: `/c/${usercommunity.community_id.communityname}`,
        }
      ))]
      : []
  ];

  //handlers
  useEffect(() => {
    if (showNotificationdrop) {
      setNewNotificationTip((prev) => (
        { ...prev, notification: false }
      ));
    }

    if (showChat) {
      setNewNotificationTip((prev) => (
        { ...prev, chat: false }
      ));
    }
  }, [showNotificationdrop, showChat]);

  const handleLogout: () => Promise<void> = async () => {
    try {
      if (userRole === 1337) {
        await updateUser({
          variables: {
            data: {
              id: userId,
              status: "INACTIVE",
            }
          }
        });
      };

      logout();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (user && userId) {
      getUserCommunities({
        variables: {
          filter: {
            user_id: userId
          }
        }
      });
    }
  }, [user]);

  return (
    <>
      <nav className="navbar">
        <div className="navhead">
          <a href={user ? "/home" : "/"} className="logowrapper">
            <img src={logo} className="logo" alt={"patch_logo"} />
          </a>
        </div>
        {user && (
          <div className="navigationbar">
            <Patdrop profile={navigationDropperprofile} droppers={navigationDroppers} />
          </div>
        )}
        <div className="searchbarwrapper">
          <Searchbox showSearchbox={showSearchbox} setShowSearchbox={setShowSearchbox} />
        </div>
        {user && (
          <div className="loginuseraccessbtns">
            <div className="loginusericns">
              <a href={"/c/popular"}>
                <i className="material-icons loginuseraccessbtnsicn white-text" title="popular"> whatshot </i>
              </a>
            </div>
            <div className="loginusericns">
              <Patcoindrop
                showPatcoindrop={showPatcoindrop}
                setShowPatcoindrop={setShowpatcoindrop}
              />
            </div>
            <div className="loginusersec"> </div>
            <div className="loginusericns">
              <i
                title="notifications"
                className="material-icons loginuseraccessbtnsicn"
                onClick={() => setShowNotificationdrop(!showNotificationdrop)}
              >
                priority_high
              </i>
              {newNotificationTip.notification && (
                <i className="material-icons tipicn"> error </i>
              )}
              <Notificationdrop
                isNewNotification={setNewNotificationTip}
                showNotificationdrop={showNotificationdrop}
                setShowNotificationdrop={setShowNotificationdrop}
              />
            </div>
            <div className="loginusericns">
              <i
                title="chat"
                onClick={() => setShowChat(true)}
                className="material-icons loginuseraccessbtnsicn"
              >
                forum
              </i>
              {newNotificationTip.chat && (
                <i className="material-icons tipicn"> error </i>
              )}
              <Chatbox
                showChatbox={showChat}
                setShowChatbox={setShowChat}
                isNewChat={setNewNotificationTip}
              />
            </div>
            <div className="loginusericns">
              <i
                title="create community"
                onClick={() => setCreateCommunity(true)}
                className="material-icons loginuseraccessbtnsicn"
              >
                group_add
              </i>
              <CreateCommunity
                setShowCreateCommunity={setCreateCommunity}
                showCreateCommunity={createCommunity}
              />
            </div>
            <div className="loginusericns">
              <Link to={cname ? `/c/${cname}/submit` : "post/new"}>
                <i className="material-icons loginuseraccessbtnsicn" title="create post"> add_to_photos </i>
              </Link>
            </div>
          </div>
        )}
        {user ? (
          <div className="userprofile">
            <Patdrop profile={profileDropperprofile} droppers={profileDroppers} />
          </div>
        ) : (
          <div className="waves-effect waves-light" id="abtn" onClick={() => setShowLogin(true)} >
            Login
          </div>
        )}
      </nav>
      <Loginbox showLogin={showLogin} setShowLogin={setShowLogin} />
    </>
  );
};

export default Navbar;