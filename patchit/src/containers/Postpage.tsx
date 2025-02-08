import React, { useEffect, useReducer } from "react";
import { useLazyQuery } from "@apollo/client";
import { useParams, Link, useNavigate } from "react-router-dom";

//utils
import { useAuth } from "../utils/hooks/useAuth";
import { getSignedUrls } from "../utils/services/s3";
import { dateFormatter, defaultUPic } from "../utils/helpers/helpers";
import {
  handlePostImages,
  handlePostLikes,
  handlePostState,
  handleSavingPost,
  handleUserReactions,
  postInitState,
  updateDBPostLikeDislikes,
  updateDBSavingPost
} from "../utils/opx/postopx";

//component
import Inforecommended from "../components/infosection/Inforecommended";
import Infocreatecard from "../components/infosection/Infocreatecard";
import Commentspace from "../components/comments/Commentspace";
import Patdrop from "../components/html/patdrop/Patdrop";
import Errorcard from "../components/cards/Errorcard";
import Loadingpage from "../components/Loadingpage";
import Postpoll from "../components/post/Postpoll";
import Postimg from "../components/post/Postimg";
import Patbtn from "../components/html/Patbtn";

//queries
import { GETPOST, SUBSCRIBETOMORECOMMENT, GETPOSTCOMMENTS } from "./queries/postpage";

//css & types, images & constants
import "./css/main.css";
import "./css/postpage.css";
import { authcontexttype } from "../context/types";
import { defaultUserPic } from "../constants/const";
import { commenttype } from "../components/comments/types";
import { ERRORTYPE, RESPONSETYPE, USER_S_N_TYPE } from "../utils/main/types";
import { infocreatecardprops } from "../components/infosection/types";
import { droppertype, profiletype } from "../components/html/patdrop/types";
import {
  newpostlikedislikestate,
  newpostsavingpinningstate,
  signedurltype,
  updatedbposttype,
  userreactiontype,
} from "../utils/types";
import {
  postlikeactiontype,
  postsaveopxtype,
} from "../components/types/posttypes";
import {
  tagtype,
  subdatatype,
  postpagetype,
  seterrortype,
  commentsubscriptiondatatype,
} from "./types/postpage";

const Postpage = () => {
  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const { postid } = useParams<Record<string, string>>();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userRole: number | null = user && user["role"];

  //queries & mutations
  const [getPost, { data, loading, error }] = useLazyQuery(GETPOST);
  const [getPostComments, {
    data: commentsData,
    loading: commentsLoading,
    subscribeToMore
  }] = useLazyQuery(GETPOSTCOMMENTS);

  //constants
  const postData: postpagetype = data?.post;

  //state
  const [postPageState, dispatch] = useReducer(handlePostState, postInitState);

  //handlers  
  const setError: seterrortype = (error: ERRORTYPE) => {
    dispatch({ type: "SET_ERROR", error });
  }

  const sortComments: profiletype = { set: "Hot" };
  const sortCommentDroppers: droppertype[] = [
    {
      title: "Hot", icn: "trending_up",
      state: "CLICKED", event: () => dispatch({ type: "SET_COMMENT_SORTBY", sortBy: "likes" })
    },
    {
      title: "New", icn: "timeline",
      state: "CLICKED", event: () => dispatch({ type: "SET_COMMENT_SORTBY", sortBy: "created_at" })
    },
  ];

  const createCardData: infocreatecardprops["data"] = {
    inCommunity: postPageState.inCommunity,
    ...postData?.community_id,
  }

  const handlePostLikeDislike: (action: postlikeactiontype) => Promise<void> = async (action) => {
    const postCurrentLikeState = {
      liked: postPageState.liked,
      postLikes: postPageState.likes
    }

    const updatedPostLikes: newpostlikedislikestate = await handlePostLikes(
      userId!,
      action,
      postCurrentLikeState
    );

    if (updatedPostLikes?.navigateTo) {
      navigate(updatedPostLikes.navigateTo);
      return;
    }

    try {
      const { newPostLikes, newLikeState } = updatedPostLikes;
      const updatingDb: updatedbposttype = await updateDBPostLikeDislikes(
        newPostLikes,
        newLikeState,
        postid!,
        userId!
      );

      if (updatingDb.status !== 200) {
        setError({ status: 500, show: true, message: "Post like failed: Something went wrong" });
        return;
      }

      dispatch({ type: "SET_LIKES", likes: newPostLikes });
      dispatch({ type: "SET_LIKED", liked: newLikeState });
    } catch (err) {
      setError({ status: 500, show: true, message: "Post like failed: Something went wrong" });
    }
  }

  const handlePostSavingPinning: (useraction: postsaveopxtype) => Promise<void> = async (useraction: postsaveopxtype) => {
    const updatedPostSaveState: newpostsavingpinningstate = await handleSavingPost({
      useraction: useraction,
      userId: userId!,
      currentsavestate: {
        savedState: postPageState.saved,
        pinnedState: postPageState.pinned
      }
    });

    if (updatedPostSaveState.navigateTo) {
      navigate(updatedPostSaveState.navigateTo);
      return;
    };

    try {
      const { newSavedState, newPinnedState } = updatedPostSaveState;
      const updatingDb: updatedbposttype = await updateDBSavingPost({
        useraction: useraction,
        userId: userId!,
        postId: postid!,
        savedState: newSavedState,
        pinnedState: newPinnedState
      });

      if (updatingDb.status !== 200) {
        setError({ status: 500, show: true, message: "Post saving failed: Something went wrong" });
        return;
      }

      dispatch({ type: "SAVE_POST", saved: newSavedState });
      dispatch({ type: "PIN_POST", pinned: newPinnedState });
    } catch (err) {
      setError({ status: 500, show: true, message: "Post saving failed: Something went wrong" });
    }
  }

  const fetchPostImages = async (post: postpagetype) => {
    const data = await handlePostImages(post);

    if (data.status === 200) {
      dispatch({ type: "SET_IMAGES", images: JSON.parse(data?.message) });
    } else {
      setError({ show: true, status: data?.status, message: data?.message });
    }
  }

  const fetchUserReactions = async (post: postpagetype) => {
    const data: RESPONSETYPE = await handleUserReactions(post, userId!);

    if (data?.status === 200) {
      const updatedUserReactions: userreactiontype = JSON.parse(data?.message);

      const { savedState, pinnedState, likedState, joinedState } = updatedUserReactions;

      dispatch({ type: "SAVE_POST", saved: savedState });
      dispatch({ type: "PIN_POST", pinned: pinnedState });
      dispatch({ type: "SET_LIKED", liked: likedState });
      dispatch({ type: "JOIN_COMMUNITY", inCommunity: joinedState });
    } else {
      setError({ show: true, status: 500, message: "Unable to fetch user reactions..." });
    }
  }

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETOMORECOMMENT,
      updateQuery: (prev: { listComments: commenttype[] }, { subscriptionData }: commentsubscriptiondatatype) => {
        const subdata: subdatatype = subscriptionData?.data;
        if (!subdata) return prev;
        const newComment: commenttype[] = subdata?.newComment;
        return {
          listComments: [...prev?.listComments, ...newComment,]
        };
      }
    });

    if (unsubscribe) return () => unsubscribe();
  }, [subscribeToMore]);

  useEffect(() => {
    if (postid && !commentsLoading) {
      (async function () {
        await getPostComments({
          variables: {
            filter: {
              post_id: postid!
            },
            sort: [{ column: postPageState.commentSortBy, order: "asec", nulls: "last" }]
          }
        });
      })();
    }
  }, [postid, postPageState.commentSortBy])

  useEffect(() => {
    if (!postid) return;

    const fetchPostData = async () => {
      try {
        const { data } = await getPost({
          variables: {
            postId: postid!,
          },
        });

        const post: postpagetype = data?.post;

        if (post) {
          const profile_pic = post.owner.profile_pic;

          if (profile_pic !== null && profile_pic.length > 0) {
            const signedUrls: signedurltype[] = await getSignedUrls({
              userId: post.owner.id,
              postId: "0",
              req: "GET",
              files: [{ name: profile_pic }]
            });

            dispatch({ type: "UPDATE_USER_PIC", user_pic: signedUrls[0].signedUrl })
          }

          if (post.type === "IMAGE") {
            await fetchPostImages(post);
          }

          dispatch({ type: "SET_LIKES", likes: post?.likes });

          if (post?.owner?.status !== "ACTIVE") {
            dispatch({ type: "SET_OWNER_STATUS", status: false });
          }

          if (userId) {
            await fetchUserReactions(post);

          } else {
            dispatch({ type: "SAVE_POST", saved: false });
            dispatch({ type: "PIN_POST", pinned: false });
            dispatch({ type: "SET_LIKED", liked: "NONE" });
          }
        }
      } catch (err) {
        setError({ show: true, status: 500, message: "Something went wrong: Fetching post failed..." });
      }
    }

    fetchPostData();
  }, [userId, postid]);

  useEffect(() => {
    const url = window.location.hash;
    if (url.includes("#comment") && !commentsLoading) {
      setTimeout(() => {
        const commentsSection = document.getElementById(url.substring(1));
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500)
    }
  }, [postid, commentsLoading]);

  if (loading) {
    return (<Loadingpage />)
  } else if (error) {
    return (<Loadingpage err={"Unable to load post..."} />)
  } else {
    return (
      <div className="flexy">
        <div className="patchcontent">
          <div className="postpageheader">
            <div className="userpicwrapper">
              <img
                className="userpic"
                onError={defaultUPic}
                alt={"user_profile_pic"}
                src={postPageState.display_user_pic || defaultUserPic}
              />
            </div>
            <div className="postpageheadlineinfo" >
              <div className="postpageinfo">
                {!postPageState.isOwnerActive ? (
                  <div className="username">deleted</div>
                ) : (
                  <>
                    <Link to={`/u/${postData?.owner?.username}`} className="username">
                      u/{postData?.owner?.username}
                    </Link>
                    {postData?.community_id !== null && (
                      <div className="communityname">
                        in
                        <Link to={`/c/${postData?.community_id?.name}`}>
                          <div className="communitynametxt">
                            c/{postData?.community_id?.name}
                          </div>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="created">{dateFormatter(postData?.created_at)}</div>
            </div>
          </div>
          <div className="postpageheading">{postData?.title}</div>
          {postData?.tags?.length > 0 && (
            <div className="posttags">
              {postData?.tags.map((tag: tagtype, idx: number) => (
                <div className="posttag" key={idx}>
                  <i className="material-icons black-text posttagicn">local_offer</i>
                  {tag.tag_id.name}
                </div>
              ))}
            </div>
          )}
          {postData?.type === "IMAGE" ? (
            <div className="postpagepostwrapper">
              {postData?.content && (
                <Postimg postImgData={postPageState.images} />
              )}
            </div>
          ) : postData?.type === "BLOG" ? (
            postData?.content && (
              <div className="postpageblog">
                {postData?.content}
              </div>
            )
          ) : postData?.type === "POLL" ? (
            <Postpoll
              pollData={postData?.content}
              pollPostId={postData?.id}
            />
          ) : postData?.type === "LINK" && (
            <a href={postData?.content}>
              {postData?.content}
            </a>
          )}
          <div className="postpagefooter">
            {userRole !== 1337 && (
              <div className="postpagefootertabs">
                <i
                  onClick={() => handlePostLikeDislike("LIKE")}
                  className={`material-icons icnspaceup ${postPageState.liked === "TRUE" && "blue-text"}`}
                >
                  mood
                </i>
                {postPageState.likes || 0}
                <i
                  onClick={() => handlePostLikeDislike("DISLIKE")}
                  className={`material-icons icnspacedown ${postPageState.liked === "FALSE" && "red-text"}`}
                >
                  sentiment_very_dissatisfied
                </i>
              </div>
            )}
            {user && userRole !== 1337 && (
              <>
                <Patbtn
                  text={postPageState?.saved ? "saved" : "save"}
                  icn={"bookmark_border"}
                  state={postPageState?.saved ? "selected" : "inactive"}
                  handleClick={() => handlePostSavingPinning("SAVE")}
                />
                <div className="lastbtn">
                  <Patbtn
                    size={"small"}
                    text={"pin"}
                    icn={"location_on"}
                    state={postPageState?.pinned ? "clear" : "inactive"}
                    handleClick={() => handlePostSavingPinning("PIN")}
                  />
                </div>
              </>
            )}
          </div>
          <div className="postpagesortby">
            {commentsData?.listComments?.length > 1 && (
              <div className="sortcomments">
                <Patdrop profile={sortComments} droppers={sortCommentDroppers} />
              </div>
            )}
            <div className="postpagesortbytrim">
              {commentsData?.listComments?.length || 0} comments
            </div>
          </div>
          <div className="commentsection" id={"comments"}>
            {commentsLoading ? (
              <Loadingpage />
            ) : (
              <Commentspace
                postId={postData?.id}
                setError={setError}
                comments={commentsData?.listComments}
              />
            )}
          </div>
        </div>
        <div className="contentinfo">
          {postPageState.isOwnerActive && postData?.community_id && (
            <Infocreatecard data={createCardData} />
          )}
          <Inforecommended />
        </div>
        <Errorcard message={postPageState?.error} />
      </div>
    );
  }
}

export default Postpage;