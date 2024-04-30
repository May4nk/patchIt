import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../common/hooks/useAuth";
import { dateFormatter } from "../common/helpers";
//component
import Postpoll from "./post/Postpoll";
//query&mutation
import { 
  GETUSERALLREACTIONS,
  POSTLIKEDISLIKE,
  INSERTUSERCOMMUNITY,
  REMOVEUSERCOMMUNITY,
  UPSERTSAVEDPOST,
  UPDATEPOST
} from "./queries/post";
//css & types
import "./css/post.css";
import { authcontexttype } from "../context/types";
import { 
  postprops,
  parsedimgtype,
  useractiontype,
  communitytype,
  savedposttype,
  reactposttype,
  postdblikestype
} from "./types/posttypes";

const Post = ({ postData, showcommunity } : postprops) => {
  const { id, title, type, content, owner, community_id, likes, created_at, comments } = postData;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth(); 
  const userId:number|null = user && Number(user["id"] || user["user_id"]);
  const parsedimgData:parsedimgtype[] = type === "IMAGE" && JSON.parse(content!);
  const totalimg:number|boolean = parsedimgData?.length > 1 && parsedimgData?.length;
  //states
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [postLikes, setPostLikes] = useState<number>(0);
  const [likeState, setLikeState] = useState<string>("none");
  const [joinState, setJoinState] = useState<boolean>(false);
  const [savedState, setSavedState] = useState<boolean>(false);
  const [pinnedState, setPinnedState] = useState<boolean>(false);
  //queries & mutations
  const [likedislikepost] = useMutation(POSTLIKEDISLIKE);
  const [joincommunity] = useMutation(INSERTUSERCOMMUNITY);
  const [leavecommunity] = useMutation(REMOVEUSERCOMMUNITY);
  const [upsertSavedPost] = useMutation(UPSERTSAVEDPOST);
  const [upsertPost] = useMutation(UPDATEPOST);
  const [getUserReactions, { data, loading }] = useLazyQuery(GETUSERALLREACTIONS);

  const allUserActions = !loading && data?.listUsers[0];
  //handlers
  const postdblikes: postdblikestype = (userreact: number, type: string, postlikenumber: number) => {
    likedislikepost({
      variables: {
        data: {
          reaction: userreact,
          post_id: Number(id),
          user_id: userId
        }
      }
    }); 
    if(type === "+") {
      upsertPost({
        variables: {
          data: {
            id: id,
            likes: likes + postlikenumber
          }
        }
      }); 
    } else if(type === "-") {
      upsertPost({
        variables: {
          data: {
            id: id,
            likes: likes - postlikenumber
          }
        }
      });
    }
  }
  const handleLike = () => {
    if(user) {
      if(likeState === "none") {
        postdblikes(1, "+", 1);
        setPostLikes(postLikes + 1);
        setLikeState("like");
      } else if(likeState === "like") {
        postdblikes(0, "-", 1);
        setPostLikes(postLikes - 1);
        setLikeState("none");
      } else if(likeState === "dislike") {
        postdblikes(1, "+", 2);
        setPostLikes(postLikes + 2);
        setLikeState("like");
      }
    } else {
      navigate("/account/login")
    }
  }

  const handleDislike = () => {
    if(user) {
      if (likeState === "none") {
        postdblikes(-1, "-", 1);
        setPostLikes(postLikes - 1);
        setLikeState("dislike");
      } else if (likeState === 'dislike'){
        postdblikes(0, "+", 1);
        setPostLikes(postLikes + 1);
        setLikeState("none");
      } else if (likeState === "like") {
        postdblikes(-1, "-", 2);
        setPostLikes(postLikes - 2);
        setLikeState("dislike");
      }
    } else {
      navigate("/account/login")
    }
  };

  const handleJoinCommunity:() => void = () => {
    if(userId !== null) {
      let joincommunitybtns = document.querySelectorAll(`.c${community_id?.communityname}`);
      joincommunitybtns.forEach((btn) => {
        btn.classList.toggle("none");
      });
      setJoinState(!joinState);
      if(joinState) {
        leavecommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: Number(community_id?.id)
            }
          }
        })
      } else {
        joincommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: Number(community_id?.id)
            }
          }
        })
      }
    } else {
      navigate("/account/login");
    }
  }
  
  const handleSavingPost: (savestate: string) => void = (savestate) => {
    if(user) {
      if(savestate === "save") {
        setSavedState(!savedState);
        upsertSavedPost({
          variables: {
            data: {
              user_id: Number(userId),
              post_id: Number(id),
              saved: savedState ? false : true
            }
          }
        });
      } else if(savestate === "pin") {
        setPinnedState(!pinnedState);
        upsertSavedPost({
          variables: {
            data: {
              user_id: Number(userId),
              post_id: Number(id),
              pinned: pinnedState ? false : true
            }
          }
        });
      }
    }
  }
  
  const prevImg = () => {
    if(currentImg !== 0) {
      setCurrentImg(currentImg - 1)
    }
  }
  
  const nextImg = () => {
    if(currentImg !== (Number(totalimg)-1)) {
      setCurrentImg(currentImg + 1)
    }
  }

  const parseImg = (parsedimgData && parsedimgData !== null) && require(`../img/${parsedimgData[currentImg].postSrc }`);

  useEffect(() => {
    if(userId !== null) {
      getUserReactions({
        variables: {
          filter: {
            id: userId!
          }
        }
      });
      setLikeState("none");
      setJoinState(false);
      setPinnedState(false);
      setSavedState(false);
      const usercommunities: useractiontype["communities"] = allUserActions?.communities;
      const usersaved: useractiontype["savedposts"] = allUserActions?.savedposts;
      const userreaction: useractiontype["reactedposts"] = allUserActions?.reactedposts;

      if(usercommunities?.length > 0) {
        if(usercommunities?.some((community: communitytype) => community?.community_id?.id === community_id?.id)){
          setJoinState(true);
        }
      }

      if(usersaved?.length !== 0) {
        if(usersaved?.some((post: savedposttype) => (post?.saved && post?.post_id?.id === id))) {
          setSavedState(true);
        }

        if(usersaved?.some((post: savedposttype) => (post?.pinned && post?.post_id?.id === id))) {
          setPinnedState(true);
        }
      }

      if(userreaction?.length > 0 ) {
        if(userreaction?.filter((post: reactposttype) => (post?.reaction === 1 && post?.post_id?.id === id)).length > 0){
          setLikeState("like");
        }

        if(userreaction?.filter((post: reactposttype) => (post?.reaction === -1 && post?.post_id?.id === id)).length > 0){
          setLikeState("dislike");
        }
      }
    } else {
      setLikeState("none");
      setSavedState(false);
      setPinnedState(false);
      setJoinState(false);
    }
  },[id, getUserReactions, allUserActions, userId, community_id?.id]);

  useEffect(() => {
    setPostLikes(likes);
  },[likes]);
  
  return (
    <div className="post hoverable">
      <div className="postcontent">
        <div className="postheader">
          <div className="posttitle">
            <div className="headingpicwrapper">
              <img src={ require(`../img/a.jpg`)} className="headingpic" alt="profile pic" />
            </div>
            <div className="pictitle">
              { showcommunity ? (
                community_id?.communityname ? (
                  <Link id="communityname" to={`/c/${ community_id?.communityname }`}>
                    c/{ community_id?.communityname }
                  </Link>
                ) : (
                  <Link id="usrname" to={`/u/${ owner?.username }`}>
                    u/{ owner?.username }
                  </Link>
                )
              ) : (
                <Link id="usrname" to={`/u/${ owner?.username }`}>
                  u/{ owner?.username }
                </Link>
              )}
              <span className="metapictitle">
                &nbsp;.&nbsp;{ `${dateFormatter(created_at)} `}
              </span>
            </div>
            { showcommunity && (
               !joinState && (
                <div className="joincommunity">
                  <div
                    className={`waves-effect waves-light joincommunitybtn black-text c${community_id?.communityname}`}
                    onClick={ handleJoinCommunity }
                  >
                    join
                  </div>
                </div>
              )
            )}
          </div>
          <a href={`/post/${id}`} className="linktoclick">
            <div className="headingtitle">
              { title }
            </div>
          </a>
        </div>
        { type === "IMAGE" ? (
          <div className="postimage">
            <img className="posts" src={parseImg} alt={"post_img"} />
            { totalimg && (
              <div className="imagectrl">
                <div className="totalimg"> {`${currentImg + 1 }/${totalimg}`} </div>
                <i className="material-icons leftimagebutton" onClick={ prevImg }>
                  chevron_left 
                </i>
                <i className="material-icons rightimagebutton" onClick={ nextImg }>
                  chevron_right
                </i>
              </div>
            )}
          </div>
        ) : type === "LINK" ? (
          <div className="postlink">
            <a href={`https://${content}`}> { content } </a>
          </div>
        ) : type === "POLL" ? (
          <div className="postpoll">
            {content && (
              <Postpoll 
                pollData={ content }
                pollPostId={ postData.id }
              />
            )}
          </div>
        ) : type === "BLOG" && (
          <div className="postblog">
            {(content && content !== null) && (
              <div className="posts"> 
                { content?.length > 353 ? `${content?.substring(0,353)}...` : content }
              </div>
            )}
          </div>
        )}
        { parsedimgData && (
          parsedimgData[currentImg]?.postCaption && (
            <div className="post_caption"> 
              { parsedimgData[currentImg]?.postCaption }
            </div>
          )
        )}
        <div className="postfooter">
          <div className="footer">
            <i className={`material-icons-outlined upvote ${likeState === "like" && "blue-text"}`} onClick={ handleLike }>
              mood
            </i>
            { postLikes }
            <i className={`material-icons-outlined downvote ${likeState === "dislike" && "red-text"}`} onClick={ handleDislike }>
              sentiment_very_dissatisfied
            </i>
          </div>
          <Link to={`/post/${id}`} className="footersave waves-light waves-effect">
            <i className="material-icons footericn">chat_bubble_outline</i>
            <div className="footertxt">{ comments?.length || 0 }</div>
          </Link>
          { user && (
            <>
              <div className="footersave waves-light waves-effect" onClick={() => handleSavingPost("save")}>
                <i className={`material-icons footericn ${ savedState && "blue-text"}`}>
                  bookmark_border
                </i>
                <div className="footertxt"> save </div>
              </div>
              <div className="footerpin waves-light waves-effect" onClick={() => handleSavingPost("pin")}>
                <i className={`material-icons footericn ${ pinnedState && "blue-text"}`}>
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