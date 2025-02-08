import React, { useEffect, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

//utils
import { useAuth } from "../../utils/hooks/useAuth";
import { getSignedUrls } from "../../utils/services/s3";
import { dateFormatter, defaultUPic } from "../../utils/helpers/helpers";
import {
  handlePostImages,
  handlePostLikes,
  handlePostState,
  handleSavingPost,
  handleUserReactions,
  postInitState,
  updateDBPostLikeDislikes,
  updateDBSavingPost
} from "../../utils/opx/postopx";

//component
import Postimg from "./Postimg";
import Postpoll from "./Postpoll";
import Patbtn from "../html/Patbtn";

//query & mutations
import {
  INSERTUSERCOMMUNITY,
  REMOVEUSERCOMMUNITY,
} from "../queries/post";

//css & types
import "./css/post.css";
import { authcontexttype } from "../../context/types";
import { posttype, RESPONSETYPE, USER_S_N_TYPE } from "../../utils/main/types";
import { defaultCommunityPic, defaultUserPic } from "../../constants/const";
import {
  likestatetype,
  newpostlikedislikestate,
  newpostsavingpinningstate,
  signedurltype,
  updatedbposttype,
  userreactiontype
} from "../../utils/types";
import {
  postpropstype,
  postsaveopxtype,
  postlikeactiontype,
} from "../types/posttypes";

const Post = (postprops: postpropstype) => {
  const { postData, showcommunity = true } = postprops;
  const { id, title, type, content, owner, community_id, likes, created_at, comments } = postData;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userRole: number | null = user && user["role"];

  //queries & mutations     
  const [joincommunity] = useMutation(INSERTUSERCOMMUNITY);
  const [leavecommunity] = useMutation(REMOVEUSERCOMMUNITY);

  //reducer
  const [postState, dispatch] = useReducer(handlePostState, postInitState);

  //handlers  
  const handleLikeDislike: (action: postlikeactiontype) => Promise<void> = async (action: postlikeactiontype) => {
    const postLikeState: likestatetype = {
      liked: postState.liked,
      postLikes: postState.likes
    }

    const updatedPostLikes: newpostlikedislikestate = await handlePostLikes(
      userId!,
      action,
      postLikeState
    );

    if (updatedPostLikes?.navigateTo) {
      navigate(updatedPostLikes.navigateTo);
      return;
    }

    try {
      const { newPostLikes, newLikeState } = updatedPostLikes;
      const updatingDb: updatedbposttype = await updateDBPostLikeDislikes(newPostLikes, newLikeState, id, userId!);

      if (updatingDb.status !== 200) {
        dispatch({
          type: "SET_ERROR",
          error: { status: 500, show: true, message: "Post like failed: Something went wrong" }
        });
        return;
      }

      dispatch({ type: "SET_LIKES", likes: newPostLikes });
      dispatch({ type: "SET_LIKED", liked: newLikeState });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: { status: 500, show: true, message: "Post like failed: Something went wrong" }
      });
    }
  }

  const handleJoinCommunity: () => Promise<void> = async () => {
    if (!userId) {
      navigate("/account/login");
      return;
    }

    dispatch({ type: "JOIN_COMMUNITY", inCommunity: !postState?.inCommunity })

    try {
      if (postState?.inCommunity) {
        await leavecommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: community_id?.id
            }
          }
        })
      } else {
        await joincommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: community_id?.id
            }
          }
        })
      }
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: { status: 500, show: true, message: "Joining community failed: Try again after a while" }
      });
    }
  }

  const handlePostSavingPinning: (useraction: postsaveopxtype) => Promise<void> = async (useraction: postsaveopxtype) => {
    const updatedPostSaveState: newpostsavingpinningstate = await handleSavingPost({
      useraction: useraction,
      userId: userId!,
      currentsavestate: {
        savedState: postState["saved"],
        pinnedState: postState["pinned"]
      }
    });

    if (updatedPostSaveState.navigateTo) {
      navigate(updatedPostSaveState.navigateTo);
    };

    try {
      const { newSavedState, newPinnedState } = updatedPostSaveState;
      const updatingDb: updatedbposttype = await updateDBSavingPost({
        useraction: useraction,
        userId: userId!,
        postId: id,
        savedState: newSavedState,
        pinnedState: newPinnedState,
      });

      if (updatingDb.status !== 200) {
        dispatch({
          type: "SET_ERROR",
          error: { status: 500, show: true, message: "Post saving failed: Something went wrong" }
        });
        return;
      }

      dispatch({ type: "SAVE_POST", saved: newSavedState });
      dispatch({ type: "PIN_POST", pinned: newPinnedState });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: { status: 500, show: true, message: "Post saving failed: Something went wrong" }
      });
    }
  }

  const fetchUserReactions = async (post: posttype) => {
    const data = await handleUserReactions(post, userId!);

    if (data.status === 200) {
      const updateUserActions: userreactiontype = JSON.parse(data?.message);
      const { savedState, pinnedState, likedState, joinedState } = updateUserActions;

      dispatch({ type: "SAVE_POST", saved: savedState });
      dispatch({ type: "PIN_POST", pinned: pinnedState });
      dispatch({ type: "SET_LIKED", liked: likedState });
      dispatch({ type: "JOIN_COMMUNITY", inCommunity: joinedState });
    } else {
      dispatch({
        type: "SET_ERROR",
        error: { show: true, status: 500, message: "Unable to fetch user reactions..." }
      });
    }
  }

  useEffect(() => {
    if (userId === null) {
      dispatch({ type: "RESET" });
      return;
    }

    (async function () {
      await fetchUserReactions(postData);
    }());

  }, [id, userId, community_id?.id]);

  useEffect(() => {
    dispatch({ type: "SET_LIKES", likes });
  }, [likes]);

  useEffect(() => {
    const user_pic: USER_S_N_TYPE = owner.profile_pic;
    const community_pic: USER_S_N_TYPE = community_id.profile_pic;

    if (showcommunity && community_id?.name) {
      if (community_pic !== null && community_pic.length > 0) {
        (async function () {
          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: community_id?.owner?.id,
            postId: "0",
            req: "GET",
            files: [{ name: community_pic }]
          });

          dispatch({ type: "UPDATE_COMMUNITY_PIC", community_pic: signedUrls[0].signedUrl })
        }());
      }
    } else {
      if (user_pic !== null && user_pic.length > 0) {
        (async function () {
          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: owner?.id,
            postId: "0",
            req: "GET",
            files: [{ name: user_pic }]
          });

          dispatch({ type: "UPDATE_USER_PIC", user_pic: signedUrls[0].signedUrl })
        }());
      }
    }
  }, [owner, community_id])

  useEffect(() => {
    if (type === "IMAGE") {
      const fetchPostImages = async () => {
        const data: RESPONSETYPE = await handlePostImages(postData);

        if (data?.status === 200) {
          dispatch({
            type: "SET_IMAGES",
            images: JSON.parse(data.message)
          })
        } else {
          dispatch({
            type: "SET_ERROR",
            error: {
              show: true,
              status: data?.status,
              message: data?.message
            }
          })
        }
      }

      fetchPostImages();
    }
  }, [id, type, content])

  return (
    <div className="post hoverable">
      <div className="postcontent">
        <div className="postheader">
          <div className="posttitle">
            <div className="headingpicwrapper">
              <img
                className="headingpic"
                alt="profile pic"
                onError={defaultUPic}
                src={showcommunity
                  ? community_id?.name
                    ? postState.display_community_pic || defaultCommunityPic
                    : postState.display_user_pic || defaultUserPic
                  : postState.display_user_pic || defaultUserPic
                }
              />
            </div>
            <div className="posttitletext">
              {showcommunity ? (
                community_id?.name ? (
                  <Link id="communityname" to={`/c/${community_id?.name}`}>
                    c/{community_id?.name}
                  </Link>
                ) : (
                  owner.status === "ACTIVE" ? (
                    <>
                      <Link id="usrname" to={`/u/${owner?.username}`}>
                        u/{owner?.username}
                      </Link>
                      <span className="metaposttitletext">
                        &nbsp;.&nbsp;{`${dateFormatter(created_at)} `}
                      </span>
                    </>
                  ) : (
                    <div className="deactivated_username">
                      deleted
                    </div>
                  )
                )
              ) : (
                owner.status === "ACTIVE" ? (
                  <Link id="usrname" to={`/u/${owner?.username}`}>
                    u/{owner?.username}
                  </Link>
                ) : (
                  <div className="deactivated_username">
                    deleted
                  </div>
                )
              )}
              {!showcommunity && (
                <span className="metaposttitletext">
                  &nbsp;.&nbsp;{`${dateFormatter(created_at)} `}
                </span>
              )}
            </div>
            {/* {(showcommunity || (owner.id !== userId)) && (
              (!postState?.inCommunity && owner.id !== userId && owner.status === "ACTIVE") && (
                <div className="joincommunity">
                  <Patbtn
                    size="small"
                    handleClick={handleJoinCommunity}
                    text={community_id ? "join" : "follow"}
                  />
                </div>
              )
            )} */}
          </div>
          <a href={`/post/${id}`} className="linktoclick">
            <div className="headingtitle">
              {title}
            </div>
          </a>
        </div>
        {type === "IMAGE" ? (
          <div className="postimagewrapper">
            {content && (
              <Postimg postImgData={postState.images} />
            )}
          </div>
        ) : type === "LINK" ? (
          <div className="postlink">
            <a href={`https://${content}`}> {content} </a>
          </div>
        ) : type === "POLL" ? (
          <div className="postpollwrapper">
            {content && (
              <Postpoll
                pollData={content}
                pollPostId={postData.id}
              />
            )}
          </div>
        ) : type === "BLOG" && (
          <div className="postblog">
            {(content && content !== null) && (
              <div className="posts">
                {content?.length > 353 ? `${content?.substring(0, 353)}...` : content}
              </div>
            )}
          </div>
        )}
        <div className="postfooter">
          {userRole !== 1337 && (
            <div className="postreact">
              <i
                onClick={() => handleLikeDislike("LIKE")}
                className={`material-icons-outlined upvote ${postState?.liked === "TRUE" && "blue-text"}`}
              >
                mood
              </i>
              {postState?.likes}
              <i
                onClick={() => handleLikeDislike("DISLIKE")}
                className={`material-icons-outlined downvote ${postState?.liked === "FALSE" && "red-text"}`}
              >
                sentiment_very_dissatisfied
              </i>
            </div>
          )}
          <Link to={`/post/${id}`}>
            <Patbtn
              icn={"chat_bubble_outline"}
              text={`${comments?.length || 0}`}
            />
          </Link>
          {user && userRole !== 1337 && (
            <>
              <Patbtn
                text={postState?.saved ? "saved" : "save"}
                icn={"bookmark_border"}
                state={postState?.saved ? "selected" : "inactive"}
                handleClick={() => handlePostSavingPinning("SAVE")}
              />
              <div className="lastbtn">
                <Patbtn
                  size={"small"}
                  text={"pin"}
                  icn={"location_on"}
                  state={postState?.pinned ? "clear" : "inactive"}
                  handleClick={() => handlePostSavingPinning("PIN")}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;