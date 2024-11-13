import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

//utils
import { useAuth } from "../../utils/hooks/useAuth";
import { dateFormatter, defaultUPic } from "../../utils/helpers";
import {
  getUserActionState,
  handlePostLikes,
  handleSavingPost,
  updateDBPostLikeDislikes,
  updateDBSavingPost
} from "../../utils/postopx";

//component
import Postimg from "./Postimg";
import Postpoll from "./Postpoll";

//query & mutations
import {
  GETUSERALLREACTIONS,
  INSERTUSERCOMMUNITY,
  REMOVEUSERCOMMUNITY,
} from "../queries/post";

//css & types
import "./css/post.css";
import { parsedimgtype } from "./types";
import { authcontexttype } from "../../context/types";
import { defaultCommunityPic } from "../../constants/const";
import {
  newpostlikedislikestate,
  newpostsavingpinningstate,
  updatedbposttype,
  useractionstatetype
} from "../../utils/types";
import {
  postprops,
  useractiontype,
  postsaveopxtype,
  postlikestatetype,
  postlikeactiontype,
} from "../types/posttypes";

const Post = ({ postData, showcommunity }: postprops) => {
  const { id, title, type, content, owner, community_id, likes, created_at, comments } = postData;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

  //states
  const [postLikes, setPostLikes] = useState<number>(0);
  const [joinState, setJoinState] = useState<boolean>(false);
  const [savedState, setSavedState] = useState<boolean>(false);
  const [pinnedState, setPinnedState] = useState<boolean>(false);
  const [likeState, setLikeState] = useState<postlikestatetype>(0);

  //queries & mutations 
  const [joincommunity] = useMutation(INSERTUSERCOMMUNITY);
  const [leavecommunity] = useMutation(REMOVEUSERCOMMUNITY);
  const [getUserReactions] = useLazyQuery(GETUSERALLREACTIONS);

  const parsedImgData: parsedimgtype[] = type === "IMAGE" ? JSON.parse(content || "") : [];

  //handlers
  const handleDefault: () => void = () => {
    setJoinState(false);
    setLikeState(0);
    setPinnedState(false);
    setSavedState(false);
  }

  const handleLikeDislike: (action: postlikeactiontype) => Promise<void> = async (action) => {
    const updatedPostLikes: newpostlikedislikestate = await handlePostLikes(userId, action, { likeState, postLikes });

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

      const updatingDb: updatedbposttype = await updateDBPostLikeDislikes(newPostLikes, userReact, id, userId!);

      if (updatingDb.status !== 200) {
        throw new Error(updatingDb.message);
      }

      setPostLikes(newPostLikes);
      setLikeState(newLikeState);

    } catch (err) {
      console.log(`Error updating likes: ${err}`);
    }
  }

  const handleJoinCommunity: () => Promise<void> = async () => {
    if (!userId) {
      navigate("/account/login");
      return;
    }

    let joincommunitybtns = document.querySelectorAll(`.c${community_id?.communityname}`);

    joincommunitybtns.forEach((btn) => {
      btn.classList.toggle("none");
    });

    setJoinState(!joinState);

    try {
      if (joinState) {
        await leavecommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: Number(community_id?.id)
            }
          }
        })
      } else {
        await joincommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: Number(community_id?.id)
            }
          }
        })
      }
    } catch (err) {
      console.log(err);
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
        Number(id),
        newSavedState,
        newPinnedState,
      )

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
    if (userId !== null) {
      getUserReactions({
        variables: {
          filter: {
            id: userId!
          }
        },
        onCompleted: ({ listUsers }) => {
          if (listUsers) {
            const userActions = listUsers[0];

            const userSaved: useractiontype["savedposts"] = userActions?.savedposts;
            const userReacted: useractiontype["reactedposts"] = userActions?.reactedposts;
            const userCommunities: useractiontype["communities"] = userActions?.communities;

            const getUserActions: useractionstatetype = getUserActionState(
              community_id?.id,
              Number(id),
              userSaved,
              userReacted,
              userCommunities
            );

            const { savedState, pinnedState, likedState, joinedState } = getUserActions;

            setSavedState(savedState);
            setPinnedState(pinnedState);
            setLikeState(likedState);
            setJoinState(joinedState);
          }
        }
      });
    } else {
      handleDefault();
    }
  }, [id, getUserReactions, userId, community_id?.id]);

  useEffect(() => {
    setPostLikes(likes);
  }, [likes]);

  return (
    <div className="post hoverable">
      <div className="postcontent">
        <div className="postheader">
          <div className="posttitle">
            <div className="headingpicwrapper">
              <img
                src={showcommunity
                  ? community_id?.communityname
                    ? community_id?.profile_pic || defaultCommunityPic
                    : owner?.profile_pic
                  : owner?.profile_pic
                }
                className="headingpic"
                alt="profile pic"
                onError={defaultUPic}
              />
            </div>
            <div className="posttitletext">
              {showcommunity ? (
                community_id?.communityname ? (
                  <Link id="communityname" to={`/c/${community_id?.communityname}`}>
                    c/{community_id?.communityname}
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
            {(showcommunity || (owner.id !== userId)) && (
              (!joinState && owner.id !== userId && owner.status === "ACTIVE") && (
                <div className="joincommunity">
                  <div
                    onClick={handleJoinCommunity}
                    className={`waves-effect waves-light joincommunitybtn ${"c" + community_id?.communityname}`}
                  >
                    {community_id ? "join" : "follow"}
                  </div>
                </div>
              )
            )}
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
              <Postimg postImgData={parsedImgData} />
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
          <div className="footer">
            <i
              onClick={() => handleLikeDislike("LIKE")}
              className={`material-icons-outlined upvote ${likeState === 1 && "blue-text"}`}
            >
              mood
            </i>
            {postLikes}
            <i
              onClick={() => handleLikeDislike("DISLIKE")}
              className={`material-icons-outlined downvote ${likeState === -1 && "red-text"}`}
            >
              sentiment_very_dissatisfied
            </i>
          </div>
          <Link to={`/post/${id}`} className="footersave waves-light waves-effect">
            <i className="material-icons footericn">chat_bubble_outline</i>
            <div className="footertxt">{comments?.length || 0}</div>
          </Link>
          {user && (
            <>
              <div
                onClick={() => handlePostSavingPinning("SAVE")}
                className="footersave waves-light waves-effect"
              >
                <i className={`material-icons footericn ${savedState && "blue-text"}`}>
                  bookmark_border
                </i>
                <div className="footertxt"> save </div>
              </div>
              <div
                onClick={() => handlePostSavingPinning("PIN")}
                className="footerpin waves-light waves-effect"
              >
                <i className={`material-icons footericn ${pinnedState && "red-text text-lighten-2"}`}>
                  location_on
                </i>
                <div className="footertxt"> pin </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Post.defaultProps = {
  showcommunity: true
}

export default Post;