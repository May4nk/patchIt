import React, { createContext, useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";

import { AuthContext } from "./authContext";

import { GETLOGGEDUSER } from "./queries";

import { loggedusercontexttype, userstate, authcontexttype, usercontextdatatype, usertype } from "./types";

const LoggedUserContext = createContext<loggedusercontexttype>({
  loggedUser: null,
  updateLoggedUser: (userstate: userstate) => {}
});

const LoggedUserProvider = (props: any) => {
  const { user }: authcontexttype = useContext(AuthContext);
  const loggedInUsername: string|null = user && user["username"];
  
  const [userState, setUserState] = useState<userstate>({ 
    new_user: true, 
    nsfw: false,
    visiblity: false,
    show_nsfw: false,
    allowppltofollow: false,
    contentvisiblity: false,
    chatreq: false,
    mentionusername: false,
    activityonpost: false,
    activityoncmnt: false,
    activityonpostfollowed: false,
    patcoinreceived: false,
    communityfollowed: false,
    birthday: false,
    announcements: false,
    sendmsg: "",
    searchshowprofile: false,
    auth_twofactor: false,
  });

  const [getUser] = useLazyQuery(GETLOGGEDUSER);
  
  const updateLoggedUser:(state: {[key in keyof userstate]: userstate[key]}) => void = (state: {[key in keyof userstate]: userstate[key]}) => {
    setUserState({ ...userState, ...state });
  }

  useEffect(() => {
    if(user !== null) {
      getUser({
        variables: {  
          filter : {
            username: loggedInUsername!       
          }      
        }
      }).then(({ data }: usercontextdatatype) => {
        if(data) {            
          const currentUser: usertype = data?.listUsers[0];          
          setUserState({
            new_user: currentUser?.new_user,
            nsfw: currentUser?.settings?.nsfw,
            visiblity: currentUser?.settings?.visiblity,
            show_nsfw: currentUser?.settings?.show_nsfw,
            allowppltofollow: currentUser?.settings?.allowppltofollow,
            contentvisiblity: currentUser?.settings?.contentvisiblity,
            chatreq: currentUser?.settings?.chatreq,
            mentionusername: currentUser?.settings?.mentionusername,
            activityonpost: currentUser?.settings?.activityonpost,
            activityoncmnt: currentUser?.settings?.activityoncmnt,
            activityonpostfollowed: currentUser?.settings?.activityonpostfollowed,
            patcoinreceived: currentUser?.settings?.patcoinreceived,
            communityfollowed: currentUser?.settings?.communityfollowed,
            birthday: currentUser?.settings?.birthday,
            announcements: currentUser?.settings?.announcements,
            sendmsg: currentUser?.settings?.sendmsg,
            searchshowprofile: currentUser?.settings?.searchshowprofile,
            auth_twofactor: currentUser?.settings?.auth_twofactor
          });      
        }
      })
    }
  },[]);

  return (
    <>
      <LoggedUserContext.Provider  
        value={ { loggedUser: userState, updateLoggedUser: updateLoggedUser } }
        { ...props }
      />
    </>
  )
}

export { LoggedUserContext, LoggedUserProvider };
