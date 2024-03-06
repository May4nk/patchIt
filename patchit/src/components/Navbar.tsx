import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../common/hooks/useAuth";
import { useLazyQuery, useMutation } from "@apollo/client";

//components
import Login from "./Login";
import CreateCommunity from "./Createcommunity";
import Chatbox from "./chatbox/Chatbox";
import Notificationdrop from "./Notificationdrop";
import Patcoindrop from "./Patcoindrop";
import Searchbox from "./searchbox/Searchbox";
import Patdrop from "./html/patdrop/Patdrop";

import { GETUSERCOMMUNITIES } from "./queries/navbar";
import { UPDATEUSER } from "../common/loginqueries";

//css & constants & types
import "./css/navbar.css";
import { navigationDropperprofile } from "../constants/patdropconst";
import { authcontexttype } from "../context/types";
import { droppertype, profiletype } from "./html/patdrop/types";

let pic: string = require("../img/a.jpg"); //change
let logo: string = require("../img/navbar_logo.png");

const Navbar = () => {
  const { cname } = useParams<string>();
  const { logout, user }: authcontexttype = useAuth();
  const userId: number|null = user && Number(user["id"] || user["user_id"]);
  const loggedInUsername: string|null = user && user["username"];
  const userRole: number|null = user && (user?.role?.id || user?.role_id);  

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [createCommunity, setCreateCommunity] = useState<boolean>(false); 
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showNotificationdrop, setShowNotificationdrop] = useState<boolean>(false);
  const [showPatcoindrop, setShowpatcoindrop] = useState<boolean>(false);
  const [showSearchbox, setShowSearchbox] = useState<boolean>(false);

  const [getUserCommunities, { data, loading }] = useLazyQuery(GETUSERCOMMUNITIES);
  const [updateUser] = useMutation(UPDATEUSER);

  //constants 
  const profileDropperprofile: profiletype = { 
    img: pic, 
    title: loggedInUsername! ,
    meta: { icn: "blur_on", title: "1 patcoin" }, 
  };

  const profileDroppers: droppertype[] = [
    { value: loggedInUsername!, icn: "perm_identity", text: true }, 
    { value: "Profile", state: "linked", link: `/u/${ loggedInUsername }` }, 
    { value: "Settings", state: "linked", link: `/u/${ loggedInUsername }/settings/profile` }, 
    { value: "Unlocked", icn:"lock_open", text: true }, 
    { last: true, value: "Patcoins", state: "linked", link: `/u/${ loggedInUsername }`, icn: "blur_on" },
    { last: true, value: "Create Community", event: () => setCreateCommunity(true), icn: "people_outline" }, 
    { value: "logout", icn: "power_settings_new", event: () => handleLogout() }
  ];

  const navigationDroppers: droppertype[] = [
    { value: "Home", icn: "home", state: "linked", link: "/home" },
    { value: "Popular", icn: "whatshot", state: "linked", link: "/c/popular" }, 
    { value: "Communities", text: true },
    ...(!loading && user && data)
      ? data?.listUsersCommunity.map((usercommunity: any) => (
        {
          value: usercommunity.community_id.communityname,
          img: usercommunity.community_id.profile_pic || pic,
          state: "linked",
          link: `/c/${usercommunity.community_id.communityname}`
        }
      )) : []
  ];

  //handlers
  const handleLogout: () => void = () => {
    if(userRole === 1337) {
      updateUser({
        variables: {
          data: {
            id: userId,
            status: "INACTIVE",
          }
        }
      });
    }
    logout();    
  }

  useEffect(() => {
    if(user && userId) {
      getUserCommunities({
        variables: {
          filter: {
            user_id: userId
          }
        }
      })
    }
  },[user]);

  return(
    <nav className="navbar">
      <div className="navhead">
          <a href={ user ? "/home" : "/" } className="logowrapper"> 
            <img src={ logo } className="logo" alt={"patch_logo"}/>
          </a>          
      </div>
      { user && ( 
        <div className="navigationbar">
          <Patdrop profile={ navigationDropperprofile } droppers={ navigationDroppers } />          
        </div>
      )}
      <div className="searchbarwrapper">     
        <Searchbox showSearchbox={ showSearchbox } setShowSearchbox={ setShowSearchbox } />
      </div>
      { user && (
        <div className="loginuseraccessbtns">
          <div className="loginusericns">
            <a href={"/c/popular"}> 
              <i className="material-icons loginuseraccessbtnsicn" title="popular"> whatshot </i> 
            </a>
          </div>
          <div className="loginusericns">
            <Notificationdrop showNotificationdrop={ showNotificationdrop } setShowNotificationdrop={ setShowNotificationdrop } icn={ "priority_high" } data={"blah"}/>
          </div>
          <div className="loginusersec"> </div>
          <div className="loginusericns">
            <i className="material-icons loginuseraccessbtnsicn" title="chat" onClick={ () => setShowChat(true) }> forum </i>
            <Chatbox showChatbox={ showChat } setShowChatbox={ setShowChat } />
          </div>
          <div className="loginusericns">
            <Patcoindrop showPatcoindrop={ showPatcoindrop } setShowpatcoindrop={ setShowpatcoindrop } icn={ "blur_on" } data={"blah"}/>
          </div>      
          <div className="loginusericns">          
            <i className="material-icons loginuseraccessbtnsicn" title="create community" onClick={ () => setCreateCommunity(true) }> people_outline </i>
            <CreateCommunity setShowCreateCommunity={ setCreateCommunity } showCreateCommunity={ createCommunity } />        
          </div>
          <div className="loginusericns">
            <Link to={ cname ? `/c/${cname}/submit` : "post/new" }>
              <i className="material-icons loginuseraccessbtnsicn" title="create post"> add_to_photos </i>
            </Link>
          </div>
        </div>
      )}
      { user ? (
        <div className="userprofile"> 
          <Patdrop profile={ profileDropperprofile } droppers={ profileDroppers } />
        </div>
      ) : (
        <div className="loginbtn">
          <button className="btn waves-effect waves-light" id="abtn" onClick={() => setShowLogin(true)} >
            Login
          </button>
          <Login showLogin={ showLogin } setShowLogin={ setShowLogin } />
        </div>
      )}
    </nav>
  );
};

export default Navbar;


