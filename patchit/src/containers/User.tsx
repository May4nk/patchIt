import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import { useAuth, useLogged } from "../utils/hooks/useAuth";
import { intialUserSetting, userReducer } from "../utils/useropx";

//components
import Infosocial from "../components/infosection/Infosocial";
import Privateprofile from "../components/Privateprofile";
import Infoabout from "../components/infosection/Infoabout";
import Infosection from "../components/infosection/Info";
import Zeropostcard from "../components/cards/Zeropostcard";
import Commentcard from "../components/cards/Commentcard";
import Errorcard from "../components/cards/Errorcard";
import Loadingpage from "../components/Loadingpage";
import Sortpanel from "../components/Sortpanel";
import Post from "../components/post/Post";
import Htab from "../components/html/Htabs";
import Newusersetup from "./Newusersetup";
import Modal from "../components/Modal";

//queries
import { GETUSER, GETSIGNEDUPUSER } from "./queries/user";

//constants, css & types
import "./css/main.css";
import { ERRORTYPE, posttype } from "../utils/main/types";
import { commentcardtype } from "../components/cards/types";
import { authcontexttype, loggedusercontexttype } from "../context/types";
import { infoaboutuserdatatype } from "../components/infosection/types";
import {
  reactedposttype,
  savedposttype,
  userfollowingtype,
  userpagetabnames,
  userpageusertype,
} from "./types/user";
const nsfwlogo: string = require(`../img/nsfwlogo.png`);

const Userpage = () => {
  const { uname } = useParams<string>();
  const navigate = useNavigate();

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);
  const { loggedUser }: loggedusercontexttype = useLogged();
  const loggedInUsername = user && user["username"];
  const isNew: boolean | undefined | null = (user && loggedUser) && loggedUser["new_user"];

  const allTabnames: userpagetabnames[] = [
    "posts",
    "comments",
    ...(user && (uname === loggedInUsername) ? ["reactions", "saved"] as userpagetabnames[] : [])
  ];

  //state
  const [sortby, setSortby] = useState<string>("likes");
  const [userOption, setUserOption] = useState<userpagetabnames>("posts");
  const [userSettings, dispatch] = useReducer(userReducer, intialUserSetting);
  const [errorMessage, setErrorMessage] = useState<ERRORTYPE>({ status: 0, message: "", show: false });

  //queries
  const [getUser, { data, loading, error }] = useLazyQuery(GETUSER);
  const [getSignedUser, {
    data: signedupuserData,
    loading: signedupuserLoading,
    error: signedupuserError
  }] = useLazyQuery(GETSIGNEDUPUSER);

  //handlers
  const uData: userpageusertype = !user ? !loading && data?.user : !signedupuserLoading && signedupuserData?.user;
  const infoAboutData: infoaboutuserdatatype = {
    ...uData,
    userSettings: userSettings,
    updateUserSettings: dispatch
  };

  const handleUserOptions: (uoption: userpagetabnames) => void = (uoption: userpagetabnames) => {
    const alreadyActiveTab = document.querySelector(`.tab${userOption}`);
    if (alreadyActiveTab) {
      alreadyActiveTab?.classList?.remove("selected");
    }
    setUserOption(uoption);
    const currentActiveTab = document.querySelector(`.tab${uoption}`);
    if (currentActiveTab) {
      currentActiveTab?.classList?.add("selected");
    }
  }

  const handleProceed: () => void = () => {
    dispatch({ type: "UPDATE", payload: { nsfw: false, showProfile: true } })
  }

  useEffect(() => {
    if (user) {
      getSignedUser({
        variables: {
          username: uname!
        },
        onCompleted: ({ user }: { user: userpageusertype }) => {
          if (user) {
            dispatch({
              type: "UPDATE", payload: {
                isNew: isNew! && user.id === userId,
                privacy: user?.privacy,
                nsfw: user?.settings?.nsfw,
                allowPplToFollow: user?.settings?.allowppltofollow,
                showProfile: user?.privacy === "PUBLIC",
              }
            })

            const userFollowers: userfollowingtype[] = user?.followers.filter((user: userfollowingtype) => (
              user.follower.id === userId
            ));

            if (userFollowers?.length > 0) {
              dispatch({ type: "UPDATE", payload: { following: "FOLLOWING" } });
            }

            if ((user?.privacy === "PRIVATE" && loggedInUsername === uname)
              || userFollowers?.length > 0
            ) {
              dispatch({ type: "UPDATE", payload: { showProfile: true } });
            }
          }
        }
      });
    } else {
      getUser({
        variables: {
          username: uname!
        },
        onCompleted: ({ user }: { user: userpageusertype }) => {
          if (user) {
            console.log(user.privacy);
            dispatch({
              type: "UPDATE", payload: {
                privacy: user?.privacy,
                nsfw: user?.settings?.nsfw,
                allowPplToFollow: user?.settings?.allowppltofollow,
                showProfile: user?.privacy === "PUBLIC",
              }
            });
          }
        }
      });
    }
  }, [uname, user]);

  useEffect(() => {
    if ((!loading || !signedupuserLoading) && userSettings?.showProfile) {
      handleUserOptions("posts");
    }
  }, [])

  if (loading || signedupuserLoading) {
    return <Loadingpage />
  } else if (error || signedupuserError) {
    return <Loadingpage err={error?.message || signedupuserError?.message} />
  } else {
    return (
      <>
        {(userSettings?.nsfw && userSettings.showProfile) && (
          <Modal
            head="NSFW profile"
            headlogo={nsfwlogo}
            btntxt={"proceed"}
            showModal={userSettings?.nsfw}
            handleUpdate={handleProceed}
            handleClose={() => navigate(-1)}
            txt={"Are you sure you want to proceed?"}
          />
        )}
        {userSettings?.showProfile && (
          <div className="useroverview">
            {allTabnames.map((usroption: userpagetabnames, idx: number) => (
              <Htab
                key={idx}
                tabname={usroption}
                handleClick={() => handleUserOptions(usroption)}
              />
            ))}
            <Newusersetup newUser={userSettings?.isNew} />
          </div>
        )}
        <div className="flexy">
          <div className="patchcontent">
            {userSettings?.showProfile ? (
              <>
                <div className="postsort">
                  <Sortpanel sort={sortby} setSort={setSortby} />
                </div>
                {!loading ? (
                  <>
                    {userOption === "posts" ? (
                      uData?.posts.length > 0 ? (
                        uData?.posts.map((post: posttype, idx: number) => (
                          <div key={idx}>
                            <Post
                              postData={post}
                              showcommunity={true}
                            />
                          </div>
                        ))
                      ) : (
                        <Zeropostcard
                          title={"No post Done yet!!"}
                          openstate={false}
                          content={[
                            {
                              title: "Create",
                              content: "Create a post",
                              unlock: "blur_on",
                              btntxt: "create post",
                              link: "/post/new"
                            }
                          ]}
                        />
                      )
                    ) : userOption === "comments" ? (
                      !loading ? (
                        uData?.comments.length > 0 ? (
                          uData?.comments.map((cmnt: commentcardtype, idx: number) => (
                            <Commentcard
                              key={idx}
                              comment={cmnt}
                              extend={true}
                            />
                          ))
                        ) : (
                          <Zeropostcard
                            title={"No comments done yet!!"}
                            openstate={false}
                            content={[
                              {
                                title: "Post something to comment on it",
                                unlock: "center_focus_weak",
                                content: "Create here",
                                btntxt: "create post",
                                link: "/post/new"
                              },
                            ]}
                          />
                        )
                      ) : (
                        <Loadingpage />
                      )
                    ) : userOption === "saved" ? (
                      !signedupuserLoading ? (
                        uData?.savedposts!.length > 0 ? (
                          uData?.savedposts!.map((post: savedposttype, idx: number) => (
                            <div key={idx}>
                              <Post
                                postData={post.post_id}
                                showcommunity={post.post_id.community_id?.communityname ? false : true}
                              />
                            </div>
                          ))
                        ) : (
                          <Zeropostcard
                            title={"No post saved yet!!"}
                            openstate={false}
                            content={[
                              {
                                title: "Don't wanna save? Create one",
                                unlock: "center_focus_weak"
                              },
                            ]}
                          />
                        )
                      ) : (
                        <Loadingpage />
                      )
                    ) : userOption === "reactions" && (
                      !signedupuserLoading ? (
                        uData?.reactedposts!.length > 0 ? (
                          uData?.reactedposts!.map((post: reactedposttype, idx: number) => (
                            <div key={idx}>
                              <Post
                                postData={post.post_id}
                                showcommunity={post.post_id.community_id?.communityname ? false : true}
                              />
                            </div>
                          ))
                        ) : (
                          <Zeropostcard
                            title={"Not reacted to any posts/comments yet!!"}
                            openstate={false}
                            content={[
                              {
                                title: "Seems you don't like/dislike anything...",
                                content: "Try creating a new post",
                                unlock: "mood_on",
                                btntxt: "create post",
                                link: "/post/new"
                              },
                            ]}
                          />
                        )
                      ) : (
                        <Loadingpage />
                      )
                    )}
                  </>
                ) : (
                  <Loadingpage />
                )}
              </>
            ) : (
              <Privateprofile />
            )}
          </div>
          <div className="contentinfo">
            {!loading ? (
              <>
                <Infoabout
                  userdata={true}
                  data={infoAboutData}
                  setError={setErrorMessage}
                />

                {uData?.ownedCommunities.length > 0 && (
                  <Infosection
                    communitypatcherdata={uData?.ownedCommunities}
                  />
                )}

                {uData?.social_links && (
                  <Infosocial
                    socialData={JSON.parse(uData?.social_links)}
                  />
                )}
              </>
            ) : (
              <Loadingpage />
            )}
          </div>

          <Errorcard message={errorMessage} />
        </div>
      </>
    );
  }
}

export default Userpage;
