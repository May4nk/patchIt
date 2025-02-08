import React, { createContext, useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

//utils
import { useAuth } from "../utils/hooks/useAuth";
import { getSignedUrls } from "../utils/services/s3";

//query
import { GETLOGGEDUSER } from "./queries";

//types
import { signedurltype } from "../utils/types";
import { USER_S_N_TYPE } from "../utils/main/types";
import {
  usertype,
  userstate,
  authcontexttype,
  loggedusercontexttype,
} from "./types";

const LoggedUserContext = createContext<loggedusercontexttype>({
  loggedUser: null,
  updateLoggedUser: (userstate: userstate) => { }
});

const LoggedUserProvider = (props: any) => {
  const { user }: authcontexttype = useAuth();
  const loggedInUsername: USER_S_N_TYPE = user && user["username"];

  //states
  const [userState, setUserState] = useState<userstate>({
    profile_pic: null,
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
    sendmsg: "ANYONE",
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
      (async function () {
        // console.log(userData);
        await getUser({
          variables: {
            filter: {
              username: loggedInUsername!
            }
          },
          onCompleted: ({ listUsers }: { listUsers: usertype[] }) => {
            const currentUser: usertype = listUsers[0];
            if (currentUser) {
              if (currentUser?.profile_pic !== null && currentUser?.profile_pic.length > 0) {
                (async function () {
                  try {
                    const signedUrls: signedurltype[] = await getSignedUrls({
                      userId: user.id,
                      postId: "0",
                      req: "GET",
                      files: [{ name: currentUser?.profile_pic! }]
                    });

                    if (signedUrls.length > 0) {
                      setUserState({
                        ...currentUser?.settings,
                        profile_pic: signedUrls[0].signedUrl || null
                      });
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }())
              } else {
                setUserState({
                  ...currentUser?.settings,
                  profile_pic: null
                })
              }
            }
          }
        });
      }())
    }
  }, [user, loggedInUsername, getUser]);

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
