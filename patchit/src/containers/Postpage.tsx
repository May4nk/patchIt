import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useParams, Link, useNavigate } from "react-router-dom";

//utils
import { dateFormatter, defaultUPic } from "../utils/helpers";
import { useAuth } from "../utils/hooks/useAuth";
import {
  getUserActionState,
  handlePostLikes,
  handleSavingPost,
  updateDBPostLikeDislikes,
  updateDBSavingPost
} from "../utils/postopx";

//component
import Inforecommended from "../components/infosection/Inforecommended";
import Infocreatecard from "../components/infosection/Infocreatecard";
import Commentspace from "../components/comments/Commentspace";
import Patdrop from "../components/html/patdrop/Patdrop";
import Loadingpage from "../components/Loadingpage";
import Postpoll from "../components/post/Postpoll";
import Postimg from "../components/post/Postimg";

//queries
import { GETUSERALLREACTIONS } from "../components/queries/post";
import { GETPOST, SUBSCRIBETOMORECOMMENT, GETPOSTCOMMENTS } from "./queries/postpage";

//css & types, images & constants
import "./css/main.css";
import "./css/postpage.css";
import { authcontexttype } from "../context/types";
import { parsedimgtype } from "../components/post/types";
import { commenttype } from "../components/comments/types";
import { droppertype, profiletype } from "../components/html/patdrop/types";
import { infocreatecardprops } from "../components/infosection/types";
import {
  newpostlikedislikestate,
  newpostsavingpinningstate,
  updatedbposttype,
  useractionstatetype
} from "../utils/types";
import {
  postlikeactiontype,
  postlikestatetype,
  postsaveopxtype,
  useractiontype,
} from "../components/types/posttypes";
import {
  tagtype,
  subdatatype,
  postpagetype,
  commentsubscriptiondatatype,
} from "./types/postpage";
import { STATUS } from "../utils/main/types";

const Postpage = () => {
  const navigate = useNavigate();

  const { user }: authcontexttype = useAuth();
  const { postid } = useParams<Record<string, string>>();
  const userId: number | null = user && Number(user["id"]);

  //queries & mutations
  const [getPost, { data, loading, error }] = useLazyQuery(GETPOST);
  const [getUserReactions] = useLazyQuery(GETUSERALLREACTIONS);
  const [getPostComments, {
    data: commentsData,
    loading: commentsLoading,
    subscribeToMore
  }] = useLazyQuery(GETPOSTCOMMENTS);

  //constants
  const postData: postpagetype = data?.post;
  const parsedImgData: parsedimgtype[] = postData?.type === "IMAGE"
    ? JSON.parse(postData?.content || "")
    : [];

  const sortComments: profiletype = { set: "Hot" };

  const sortCommentDroppers: droppertype[] = [
    { title: "Hot", icn: "trending_up", state: "CLICKED", event: () => setCommentSort("likes") },
    { title: "New", icn: "timeline", state: "CLICKED", event: () => setCommentSort("created_at") },
  ];

  //states
  const [inCommunity, setInCommunity] = useState(false);
  const [postLikes, setPostLikes] = useState<number>(0);
  const [savedState, setSavedState] = useState<boolean>(false);
  const [pinnedState, setPinnedState] = useState<boolean>(false);
  const [commentSort, setCommentSort] = useState<string>("likes");
  const [likeState, setLikeState] = useState<postlikestatetype>(0);
  const [postOwnerStatus, setPostOwnerStatus] = useState<STATUS>("ACTIVE");

  //handlers  
  const createCardData: infocreatecardprops["data"] = {
    inCommunity,
    ...postData?.community_id
  }

  const handlePostLikeDislike: (action: postlikeactiontype) => Promise<void> = async (action) => {
    const updatedPostLikes: newpostlikedislikestate = await handlePostLikes(
      userId,
      action,
      { likeState, postLikes }
    );

    if (updatedPostLikes?.navigateTo) {
      navigate(updatedPostLikes.navigateTo);
      return;
    }

    try {
      const { newPostLikes, newLikeState } = updatedPostLikes;

      let userReact: postlikestatetype = 1;

      if (action === "LIKE") {
        if (likeState === null) {
          userReact = 1;
        } else if (likeState === 1) {
          userReact = 0;
        } else if (likeState === 0) {
          userReact = 1;
        }
      } else if (action === "DISLIKE") {
        if (likeState === null) {
          userReact = -1;
        } else if (likeState === 0) {
          userReact = 0;
        } else if (likeState === 1) {
          userReact = -1;
        }
      }

      const updatingDb: updatedbposttype = await updateDBPostLikeDislikes(
        newPostLikes,
        userReact,
        Number(postid),
        userId!
      );

      if (updatingDb.status !== 200) {
        throw new Error(updatingDb.message);
      }

      setPostLikes(newPostLikes);
      setLikeState(newLikeState);

    } catch (err) {
      console.log(`Error updating likes: ${err}`);
    }
  }

  const handlePostSavingPinning: (useraction: postsaveopxtype) => Promise<void> = async (useraction: postsaveopxtype) => {
    const updatedPostSaveState: newpostsavingpinningstate = await handleSavingPost(
      useraction,
      userId,
      { savedState, pinnedState }
    );

    if (updatedPostSaveState.navigateTo) {
      navigate(updatedPostSaveState.navigateTo);
    };

    try {
      const { newSavedState, newPinnedState } = updatedPostSaveState;

      const updatingDb: updatedbposttype = await updateDBSavingPost(
        useraction,
        userId,
        Number(postid),
        newSavedState,
        newPinnedState,
      );

      if (updatingDb.status !== 200) {
        throw new Error(updatingDb.message);
      }

      setSavedState(newSavedState);
      setPinnedState(newPinnedState);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETOMORECOMMENT,
      onError: err => console.log(err),
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
      getPostComments({
        variables: {
          filter: {
            post_id: Number(postid!)
          },
          sort: [{ column: commentSort, order: "asec", nulls: "last" }]
        }
      });
    }
  }, [postid, commentSort])

  useEffect(() => {
    if (postid) {
      getPost({
        variables: {
          postId: Number(postid!)
        },
        onCompleted: ({ post }: { post: postpagetype }) => {
          if (post) {
            setPostLikes(post?.likes);
            if (post?.owner?.status !== "ACTIVE") {
              setPostOwnerStatus(post?.owner?.status);
            }

            if (userId) {
              getUserReactions({
                variables: {
                  filter: {
                    id: userId
                  }
                },
                onCompleted: ({ listUsers }) => {
                  if (listUsers) {
                    const userActions: useractiontype = listUsers[0];

                    const userSaved: useractiontype["savedposts"] = userActions?.savedposts;
                    const userReacted: useractiontype["reactedposts"] = userActions?.reactedposts;
                    const userCommunities: useractiontype["communities"] = userActions?.communities;

                    const getUserActions: useractionstatetype = getUserActionState(
                      Number(post?.community_id.id),
                      Number(postid),
                      userSaved,
                      userReacted,
                      userCommunities
                    );

                    const { savedState, pinnedState, likedState, joinedState } = getUserActions;

                    setSavedState(savedState);
                    setPinnedState(pinnedState);
                    setLikeState(likedState);
                    setInCommunity(joinedState);
                  }
                }
              });
            } else {
              setLikeState(0);
              setPinnedState(false);
              setSavedState(false);
            }
          }
        }
      })
    }
  }, [userId, postid]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("#comment") && !commentsLoading) {
      setTimeout(() => {
        const commentsSection = document.getElementById(hash.substring(1));
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500)
    }
  }, [postid]);

  if (loading) {
    return (<Loadingpage />)
  } else if (error) {
    return (<Loadingpage err={error.message} />)
  } else {
    return (
      <div className="flexy">
        <div className="patchcontent">
          <div className="postpageheader">
            <div className="userpicwrapper">
              <img
                className="userpic"
                alt={"user_profile_pic"}
                src={postData?.owner?.profile_pic}
                onError={defaultUPic}
              />
            </div>
            <div className="postpageheadlineinfo" >
              <div className="postpageinfo">
                {postOwnerStatus !== "ACTIVE" ? (
                  <div className="username">
                    deleted
                  </div>
                ) : (
                  <>
                    <Link to={`/u/${postData?.owner?.username}`} className="username">
                      u/{postData?.owner?.username}
                    </Link>
                    {postData?.community_id !== null && (
                      <div className="communityname">
                        in
                        <Link to={`/c/${postData?.community_id?.communityname}`}>
                          <div className="communitynametxt">
                            c/{postData?.community_id?.communityname}
                          </div>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="created">
                {dateFormatter(postData?.created_at)}
              </div>
            </div>
          </div>
          <div className="postpageheading">
            {postData?.title}
          </div>
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
                <Postimg postImgData={parsedImgData} />
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
            <div className="postpagefootertabs">
              <i
                onClick={() => handlePostLikeDislike("LIKE")}
                className={`material-icons icnspaceup ${likeState === 1 && "blue-text"}`}
              >
                mood
              </i>
              {postLikes || 0}
              <i
                onClick={() => handlePostLikeDislike("DISLIKE")}
                className={`material-icons icnspacedown ${likeState === -1 && "red-text"}`}
              >
                sentiment_very_dissatisfied
              </i>
            </div>
            {user && (
              <>
                <div
                  onClick={() => handlePostSavingPinning("SAVE")}
                  className="postpagefootertabs waves-effect waves-light"
                >
                  <i className={`material-icons icnspacesave ${savedState && "blue-text"}`}>
                    bookmark_outline
                  </i>
                  Save
                </div>
                <div
                  onClick={() => handlePostSavingPinning("PIN")}
                  className="postpagefooterpintab waves-effect waves-light"
                >
                  <i className={`material-icons icnspacesave ${pinnedState && "red-text text-lighten-2"}`}>
                    location_on
                  </i>
                  Pin
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
                postId={Number(postData?.id)}
                comments={commentsData?.listComments}
              />
            )}
          </div>
        </div>
        <div className="contentinfo">
          {postOwnerStatus !== "INACTIVE" && postData?.community_id && (
            <Infocreatecard data={createCardData} />
          )}
          <Inforecommended />
        </div>
      </div>
    );
  }
}

export default Postpage;