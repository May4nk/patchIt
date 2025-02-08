import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useMemo, useReducer } from "react";

//utils
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
import { USER_S_N_TYPE } from "../../utils/main/types"
import { droppertype, profiletype } from "../html/patdrop/types";
import { navigationDropperprofile } from "../../constants/patdropconst";
import { defaultCommunityPic, defaultUserPic } from "../../constants/const";
import { authcontexttype, loggedusercontexttype } from "../../context/types";
import { handlenavbarstatetype, navbarstateactiontype, navbarstatetype, usercommunitytype } from "./types";

const logo: string = require("../../img/navbar_logo.png");

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userRole: number | null = user && user["role"];
  const { loggedUser }: loggedusercontexttype = useLogged();
  const loggedInUsername: USER_S_N_TYPE = user && user["username"];
  const profile_pic: USER_S_N_TYPE = loggedUser?.profile_pic || null;

  //states
  const navbarInitState: navbarstatetype = {
    showChat: false,
    showLogin: false,
    showSearch: false,
    createCommunity: false,
    showCoinBar: false,
    showNotifications: false,
    newChat: 0,
    newNotification: 0
  }

  const handleNavbarState: handlenavbarstatetype = (state: navbarstatetype, action: navbarstateactiontype) => {
    switch (action.type) {
      case "SHOW_CHAT":
        return { ...state, showChat: action.show }
      case "SHOW_NOTIFICATIONS":
        return { ...state, showNotifications: action.show }
      case "SHOW_LOGIN":
        return { ...state, showLogin: action.show }
      case "SHOW_COINBAR":
        return { ...state, showCoinBar: action.show }
      case "SHOW_SEARCH":
        return { ...state, showSearch: action.show }
      case "CREATE_COMMUNITY":
        return { ...state, createCommunity: action.show }
      case "NEW_CHAT":
        return { ...state, newChat: action.newChatMessages }
      case "NEW_NOTIFICATIONS":
        return { ...state, newNotification: action.newNotification }
      default:
        return state
    }
  }

  const [navbarState, dispatch] = useReducer(handleNavbarState, navbarInitState);
  // const [newNotificationTip, setNewNotificationTip] = useState<newnotificationtiptype>({
  //   chat: false,
  //   notification: false
  // });

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
    { title: "Settings", state: "LINKED", link: `/u/${loggedInUsername}/settings` },
    { title: "Unlocked", icn: "lock_open", text: true },
    { last: true, title: "Patcoins", state: "LINKED", link: `/u/${loggedInUsername}`, icn: "blur_on" },
    { last: true, title: "Create Community", event: () => dispatch({ type: "CREATE_COMMUNITY", show: true }), icn: "people_outline" },
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
          title: usercommunity.community_id.name,
          img: usercommunity.community_id.profile_pic || defaultCommunityPic,
          link: `/c/${usercommunity.community_id.name}`,
        }
      ))]
      : []
  ];

  //handlers
  const handleTip = (type, val) => {
    if (type === "NEW_CHAT") {
      dispatch({ type: "NEW_CHAT", newChatMessages: val });
    } else {
      dispatch({ type: "NEW_NOTIFICATIONS", newNotification: val });
    }
  }

  const setShow = (type, val) => {
    dispatch({ type, show: val });
  }

  // useEffect(() => {
  //   if (navbarState?.showNotifications) {
  //     setNewNotificationTip((prev) => (
  //       { ...prev, notification: false }
  //     ));
  //   }

  //   if (navbarState?.showChat) {
  //     setNewNotificationTip((prev) => (
  //       { ...prev, chat: false }
  //     ));
  //   }
  // }, [navbarState?.showNotifications, navbarState?.showChat]);

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
      if (userRole === 1337) {
        navigate("/");
      }

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (userId) {
      getUserCommunities({
        variables: {
          filter: {
            user_id: userId
          }
        }
      });
    }
  }, [userId, getUserCommunities]);

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
            <Patdrop
              profile={navigationDropperprofile}
              droppers={navigationDroppers}
            />
          </div>
        )}
        <div className="searchbarwrapper">
          <Searchbox
            showSearchbox={navbarState?.showSearch}
            setShowSearchbox={(val: boolean) => setShow("SHOW_SEARCH", val)}
          />
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
                showPatcoindrop={navbarState?.showCoinBar}
                setShowPatcoindrop={(val: boolean) => setShow("SHOW_COINBAR", val)}
              />
            </div>
            <div className="loginusersec"> </div>
            <div className="loginusericns">
              <i
                title="notifications"
                className="material-icons loginuseraccessbtnsicn"
                onClick={() => dispatch({ type: "SHOW_NOTIFICATIONS", show: !navbarState?.showNotifications })}
              >
                priority_high
              </i>
              {navbarState?.newNotification > 0 && (
                <div className="notificationtip">
                  <div className="notificationtipnumber">
                    {navbarState.newNotification > 30 ? ".." : navbarState?.newNotification}
                  </div>
                </div>
              )}
              <Notificationdrop
                isNewNotification={(val) => handleTip("NEW_NOTIFICATION", val)}
                showNotificationdrop={navbarState?.showNotifications}
                setShowNotificationdrop={(val: boolean) => setShow("SHOW_NOTIFICATIONS", val)}
              />
            </div>
            <div className="loginusericns">
              <i
                title="chat"
                onClick={() => setShow("SHOW_CHAT", true)}
                className="material-icons loginuseraccessbtnsicn"
              >
                forum
              </i>
              {navbarState.newChat > 0 && (
                <div className="notificationtip">
                  <div className="notificationtipnumber">
                    {navbarState.newChat > 10 ? ".." : navbarState?.newChat}
                  </div>
                </div>
              )}
              <Chatbox
                showChatbox={navbarState?.showChat}
                isNewChat={(val) => handleTip("NEW_CHAT", val)}
                setShowChatbox={(val: boolean) => setShow("SHOW_CHAT", val)}
              />
            </div>
            <div className="loginusericns">
              <i
                title="create community"
                className="material-icons loginuseraccessbtnsicn"
                onClick={() => dispatch({ type: "CREATE_COMMUNITY", show: true })}
              >
                group_add
              </i>
              <CreateCommunity
                showCreateCommunity={navbarState?.createCommunity}
                setShowCreateCommunity={(val: boolean) => setShow("CREATE_COMMUNITY", val)}
              />
            </div>
            <div className="loginusericns">
              <Link to={"/create/post"}>
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
          <div className="waves-effect waves-light" id="abtn" onClick={() => setShow("SHOW_LOGIN", true)} >
            Login
          </div>
        )}
      </nav>
      <Loginbox showLogin={navbarState?.showLogin} setShowLogin={(val) => setShow("SHOW_LOGIN", val)} />
    </>
  );
};

export default Navbar;