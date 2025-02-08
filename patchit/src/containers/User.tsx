import React, { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//utils
import { getSignedUrls } from "../utils/services/s3";
import { useAuth, useLogged } from "../utils/hooks/useAuth";
import { handleUserState, userInitState } from "../utils/opx/useropx";

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

//constants, css, image & types
import "./css/main.css";
import { authcontexttype, loggedusercontexttype } from "../context/types";
import { commentcardtype } from "../components/cards/types";
import { posttype, USER_S_N_TYPE } from "../utils/main/types";
import { signedfiletype, signedurltype } from "../utils/types";
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
  const navigate = useNavigate();
  const { uname } = useParams<string>();
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userRole: number | null = user && user["role"];
  const loggedInUsername: USER_S_N_TYPE = user && user["username"];
  const allTabnames: userpagetabnames[] = [
    "posts",
    "comments",
    ...(user &&
      (uname === loggedInUsername)
      ? userRole !== 1337
        ? (["reactions", "saved"] as userpagetabnames[])
        : []
      : []
    )
  ];

  //states
  const [sortBy, setSortBy] = useState<string>("likes");
  const [userState, dispatch] = useReducer(handleUserState, userInitState);

  //queries
  const [getUser, { data, loading, error }] = useLazyQuery(GETUSER);
  const [getSignedInUser, {
    data: signedupuserData,
    loading: signedupuserLoading,
    error: signedupuserError
  }] = useLazyQuery(GETSIGNEDUPUSER);

  //handlers
  const uData: userpageusertype = !user ? !loading && data?.user : !signedupuserLoading && signedupuserData?.user;

  const handleUserOptions: (uoption: userpagetabnames) => void = (uoption: userpagetabnames) => {
    const alreadyActiveTab = document.querySelector(`.tab${userState.activeTab}`);
    if (alreadyActiveTab) {
      alreadyActiveTab?.classList?.remove("selected");
    }

    dispatch({ type: "SET_ACTIVE_TAB", selectedTab: uoption })

    const currentActiveTab = document.querySelector(`.tab${uoption}`);
    if (currentActiveTab) {
      currentActiveTab?.classList?.add("selected");
    }
  }

  const handleProceed: () => void = () => {
    dispatch({ type: "UPDATE_SETTINGS", settings: { nsfw: false } });
  }

  const handleFetchedUser = async ({ user }: { user: userpageusertype }) => {
    if (user) {
      const userSettings: userpageusertype["settings"] = user?.settings;
      const profile_pic: USER_S_N_TYPE = user?.profile_pic;
      const background_pic: USER_S_N_TYPE = user?.background_pic;

      if (profile_pic || background_pic) {
        const images: signedfiletype[] = []
        if (background_pic !== null) {
          images.push({ name: background_pic })
        }

        if (profile_pic !== null) {
          images.push({ name: profile_pic })
        }

        if (images.length > 0) {
          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: user.id,
            postId: "0",
            req: "GET",
            files: images
          });

          signedUrls.map((url: signedurltype) => (
            url.fileUrl.includes(`profile_pic`)
              ? dispatch({ type: "UPDATE_PIC", profile_pic: url.signedUrl })
              : dispatch({ type: "UPDATE_BG_PIC", background_pic: url.signedUrl })
          ))
        }
      }

      dispatch({
        type: "UPDATE_SETTINGS",
        settings: {
          isNew: (user?.new_user && userRole !== 1337) && user.id === userId,
          nsfw: userSettings?.nsfw,
          allowPplToFollow: userSettings?.allowppltofollow,
          isProfilePrivate: user?.privacy === "PRIVATE",
        },
      });

      if (userId) {
        const userFollowers: userfollowingtype[] = user?.followers.filter((user: userfollowingtype) => (
          user.follower.id === userId
        ));

        if (userFollowers?.length > 0) {
          dispatch({ type: "UPDATE_SETTINGS", settings: { following: "FOLLOWING" } });
        }

        if ((user?.privacy === "PRIVATE" && loggedInUsername === uname)
          || userFollowers?.length > 0
        ) {
          dispatch({ type: "UPDATE_SETTINGS", settings: { isProfilePrivate: false } });
        }
      }
    }
  };

  const infoAboutData: infoaboutuserdatatype = {
    ...uData,
    profile_pic: userState.display_profile_pic,
    background_pic: userState.display_background_pic,
    userSettings: userState.settings,
    updateUserSettings: dispatch
  };

  useEffect(() => {
    if (!userState.settings?.isProfilePrivate) {
      handleUserOptions("posts");
    }
  }, [userState.settings.isProfilePrivate])

  useEffect(() => {

  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        await getSignedInUser({
          variables: { username: uname },
          onCompleted: handleFetchedUser,
        });
      } else {
        await getUser({
          variables: { username: uname },
          onCompleted: handleFetchedUser
        });
      }
    };

    fetchUser();
  }, [getUser, getSignedInUser, uname, user]);

  if (loading || signedupuserLoading) {
    return <Loadingpage />
  } else if (error || signedupuserError) {
    return <Loadingpage err={"Unable to find user..."} />
  } else {
    return (
      <>
        {(userState.settings?.nsfw && !userState.settings?.isProfilePrivate) && (
          <Modal
            head="NSFW profile"
            headlogo={nsfwlogo}
            btntxt={"proceed"}
            showModal={userState.settings?.nsfw}
            handleUpdate={handleProceed}
            handleClose={() => navigate(-1)}
            txt={"Are you sure you want to proceed?"}
          />
        )}
        {!userState.settings?.isProfilePrivate && (
          <div className="useroverview">
            {allTabnames.map((usroption: userpagetabnames, idx: number) => (
              <Htab
                key={idx}
                tabname={usroption}
                handleClick={() => handleUserOptions(usroption)}
              />
            ))}
            {userId && (
              <Newusersetup newUser={userState.settings?.isNew} />
            )}
          </div>
        )}
        <div className="flexy">
          <div className="patchcontent">
            {!userState.settings?.isProfilePrivate ? (
              <>
                <div className="postsort">
                  <Sortpanel sort={sortBy} setSort={setSortBy} />
                </div>
                {!loading ? (
                  <>
                    {userState.activeTab === "posts" ? (
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
                    ) : userState.activeTab === "comments" ? (
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
                    ) : userState.activeTab === "saved" ? (
                      !signedupuserLoading ? (
                        uData?.savedposts!.length > 0 ? (
                          uData?.savedposts!.map((post: savedposttype, idx: number) => (
                            <div key={idx}>
                              <Post
                                postData={post.post_id}
                                showcommunity={post.post_id.community_id?.name ? false : true}
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
                    ) : userState.activeTab === "reactions" && (
                      !signedupuserLoading ? (
                        uData?.reactedposts!.length > 0 ? (
                          uData?.reactedposts!.map((post: reactedposttype, idx: number) => (
                            <div key={idx}>
                              <Post
                                postData={post.post_id}
                                showcommunity={post.post_id.community_id?.name ? false : true}
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
            {!loading && uData ? (
              <>
                <Infoabout
                  userdata={true}
                  data={infoAboutData}
                />
                {uData.ownedCommunities && uData?.ownedCommunities.length > 0 && (
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

          <Errorcard message={userState.error} />
        </div>
      </>
    );
  }
}

export default Userpage;
