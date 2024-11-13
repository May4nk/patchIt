import React, { createContext, useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import { useAuth } from "../utils/hooks/useAuth";

//query
import { GETLOGGEDUSER } from "./queries";

//types
import {
  loggedusercontexttype,
  userstate,
  authcontexttype,
  usercontextdatatype,
  usertype
} from "./types";

const LoggedUserContext = createContext<loggedusercontexttype>({
  loggedUser: null,
  updateLoggedUser: (userstate: userstate) => { }
});

const LoggedUserProvider = (props: any) => {
  const { user }: authcontexttype = useAuth();
  const loggedInUsername: string | null = user && user["username"];

  //states
  const [userState, setUserState] = useState<userstate>({
    profile_pic: "",
    new_user: false,
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
    blocked: "",
  });

  //query
  const [getUser] = useLazyQuery(GETLOGGEDUSER);

  //handlers
  const updateLoggedUser: (state: { [key in keyof userstate]: userstate[key] }) => void = (
    state: { [key in keyof userstate]: userstate[key] }
  ) => {
    setUserState({ ...userState, ...state });
  }

  useEffect(() => {
    if (user !== null) {
      getUser({
        variables: {
          filter: {
            username: loggedInUsername!
          }
        }
      }).then(({ data }: usercontextdatatype) => {
        if (data) {
          const currentUser: usertype = data?.listUsers[0];
          if (currentUser) {
            setUserState({
              ...currentUser?.settings,
              new_user: currentUser?.new_user,
              profile_pic: currentUser?.profile_pic
            });
          }
        }
      })
    }
  }, [user]);

  return (
    <>
      <LoggedUserContext.Provider
        value={{ loggedUser: userState, updateLoggedUser: updateLoggedUser }}
        {...props}
      />
    </>
  )
}

export { LoggedUserContext, LoggedUserProvider };
