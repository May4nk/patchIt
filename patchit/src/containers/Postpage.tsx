import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../common/hooks/useAuth";
import { dateFormatter } from "../common/helpers";

//component
import Inforecommended from "../components/infosection/Inforecommended";
import Loadingpage from "../components/Loadingpage";
import Commentspace from "../components/comments/Commentspace";
import Patdrop from "../components/html/patdrop/Patdrop";

//queries
import { GETPOST, SUBSCRIBETOMORECOMMENT, GETUSERALLREACTIONS } from "./queries/postpage";
import { POSTLIKEDISLIKE, UPSERTSAVEDPOST, UPDATEPOST } from "../components/queries/post";

//css & types & constants
import "./css/main.css";
import "./css/postpage.css"; 
import { parsedimgtype } from "../components/types/posttypes";
import { commenttype } from "../components/comments/types";
import { authcontexttype } from "../context/types";
import { droppertype } from "../components/html/patdrop/types";
import { sortprofile } from "../constants/patdropconst";
import { postdblikestype } from "../components/types/posttypes";
import { 
  commentsubscriptiondatatype,  
  subdatatype,
  postpagetype,
  usersavedtype,
  reactedposttype,
  savedposttype,
  polltype
} from "./types/postpage";

//image
let pic: string = require("../img/a.jpg");

const Postpage = () => {
  const { postid } = useParams<Record<string, string>>();
  const { user }: authcontexttype = useAuth(); 
  const userId:number|null = user && Number(user["id"] || user["user_id"]);
  const navigate = useNavigate();
  
  const [getPost, { data, loading, error,  subscribeToMore }] = useLazyQuery(GETPOST);
  const [likedislikepost] = useMutation(POSTLIKEDISLIKE);
  const [upsertSavedPost] = useMutation(UPSERTSAVEDPOST);
  const [upsertPost] = useMutation(UPDATEPOST);
  const [getUserReactions, { data: userreactionData, loading: userreactionLoading }] = useLazyQuery(GETUSERALLREACTIONS);


  //constants
  const postData: postpagetype = !loading ? data?.post : {};
  const parsedimgData:parsedimgtype[] = postData?.type === "IMAGE" ? JSON.parse(postData.content) : [];
  const totalimg:number = parsedimgData.length;
  
  const sortdroppers: droppertype[] = [
    { value: "popular", icn: "whatshot" },
    { value: "newest", icn: "trending_up" }
  ];

  //state
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [postLikes, setPostLikes] = useState<number>(0);
  const [savedState, setSavedState] = useState<boolean>(false);
  const [pinnedState, setPinnedState] = useState<boolean>(false);
  const [likeState, setLikeState] = useState<string>("none");

  const allUserActions: usersavedtype = !userreactionLoading && userreactionData?.listUsers[0];
 
  //handlers
  const postdblikes: postdblikestype = (userreact: number, type: string, postlikenumber: number) => {
    likedislikepost({
      variables: {
        data: {
          reaction: userreact,
          post_id: Number(postData.id),
          user_id: userId
        }
      }  
    }); 
    if(type === "+") {
      upsertPost({
        variables: {
          data: {
            id: postData.id,
            likes: postData.likes + postlikenumber
          }
        }
      }); 
    } else if(type === "-") {
      upsertPost({
        variables: {
          data: {
            id: postData.id,
            likes: postData.likes - postlikenumber
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

  const handleSavingPost: (savestate: string) => void = (savestate) => {
    if (savestate === "save") {
      setSavedState(!savedState);
      upsertSavedPost({
        variables: {
          data: {
            user_id: Number(userId),
            post_id: Number(postid),
            saved: savedState ? false : true
          }
        }
      });
    } else if (savestate === "pin") {
      setPinnedState(!pinnedState);
      upsertSavedPost({
        variables: {
          data: {
            user_id: Number(userId),
            post_id: Number(postid),
            pinned: pinnedState ? false : true
          }
        }
      });
    }  
  }

  const prevImg:() => void = () => {
    if(currentImg !== 0) {
      setCurrentImg(currentImg - 1)
    }
  }
  
  const nextImg:() => void = () => {
    if(currentImg !== (Number(totalimg)-1)) {
      setCurrentImg(currentImg + 1)
    }
  }

  useEffect(() => {      
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETOMORECOMMENT,
      onError: err => console.log(err),
      updateQuery: (prev: { post: postpagetype } , { subscriptionData }: commentsubscriptiondatatype) => {        
        const subdata: subdatatype = subscriptionData?.data;
        if (!subdata) return prev;
        const newComment: commenttype[] = subdata?.newComment;      
        return Object.assign({}, prev, { 
          post: {
            ...prev?.post,
            comments: [...prev?.post.comments, ...newComment]
          }
        });
      }
    });    

    if(unsubscribe) return () => unsubscribe();
  }, [subscribeToMore]);

  useEffect(() => {
    if(postid) {
      getPost({
        variables: {
          postId:Number(postid!)
        }
      }).then(({ data }: {data: {post: postpagetype}}) => {
        if(data) {
          setPostLikes(data?.post?.likes);
        }
      });
    }
  }, [postid, getPost]);

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
      setPinnedState(false);
      setSavedState(false);

      const userSaved: usersavedtype["savedposts"] = allUserActions?.savedposts;
      const userReacted: usersavedtype["reactedposts"] = allUserActions?.reactedposts;

      if(userSaved?.length > 0) {
        if(userSaved?.some((post: savedposttype) => (post.saved && post?.post_id?.id === Number(postid!)))){
          setSavedState(true);
        }

        if(userSaved?.some((post: savedposttype) => (post.pinned && post?.post_id?.id === Number(postid!)))){
          setPinnedState(true);
        }
      }

      if(userReacted?.length > 0 ) {
        if(userReacted?.some((post: reactedposttype) => (post.reaction === 1 && post?.post_id?.id === Number(postid!)))){
          setLikeState("like");
        }

        if(userReacted?.some((post: reactedposttype) => (post.reaction === -1 && post?.post_id?.id === Number(postid!)))){
          setLikeState("dislike");
        }
      }  
    } else {
      setLikeState("none");
      setPinnedState(false);
      setSavedState(false);
    }    
  },[userId, allUserActions, postid, getUserReactions])

  if (loading) {
    return ( <Loadingpage /> )
  } else if(error) {
    return (<Loadingpage err={error.message}/>)
  } else {
    return (
      <div className="flexy">
        <div className="contentpost">
          <div className="postpageheader">
            <div className="userpicwrapper">
              <img src={ pic } className="userpic" alt={"user_profile_pic"}/>
            </div>
            <div className="postpageheadlineinfo" >
              <div className="postpageinfo">
                <Link to={`/u/${ postData?.owner?.username }`} className="username">
                  u/{ postData?.owner?.username} 
                </Link>
                { postData?.community_id !== null && (
                  <div className="communityname">
                    in
                    <Link to={`/c/${ postData?.community_id?.communityname }`}>
                      <div className="communitynametxt">
                        c/{ postData?.community_id?.communityname }
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              <div className="created">
                { dateFormatter(postData?.created_at) }
              </div>
            </div>
          </div>
          <div className="postpageheading">
            { postData?.title }
          </div>
          { postData?.type === "IMAGE" ? (            
            <div className="postpagepostwrapper">
              <img src={ require(`../img/${parsedimgData[currentImg].postSrc}`)} className="postpagepost" alt={"pic"}/>
              { totalimg > 1 && ( 
                <>
                  <div className="allimages"> { `${currentImg + 1 } / ${totalimg}` } </div>                  
                  <i className="material-icons leftimagebutton" onClick={ prevImg }> chevron_left </i>
                  <i className="material-icons rightimagebutton" onClick={ nextImg }> chevron_right </i>
                </>
              )}
              { parsedimgData[currentImg]?.postCaption && (
                <div className="postpage_caption"> 
                  { parsedimgData[currentImg]?.postCaption }
                </div>
              )}
            </div>            
          ) : postData?.type === "BLOG" ? (
            postData?.content && (
              <div className="postpageblog">
                { postData?.content }
              </div>
            )
          ) : postData?.type === "POLL" ? (
            postData?.content && (
              <div className="pollwrapper">
                { JSON.parse(postData?.content).map((poll: polltype, idx: number) => (
                  <div className="postpagepolloptions" key={ idx }>
                    { poll.poll }
                    <div className="pollrating">
                      0 %
                    </div>
                  </div>
                ))}
              </div>
            )                          
          ) : postData?.type === "LINK" && (
            <a href={ postData?.content }> 
              { postData?.content }
            </a>
          )}
          <div className="postpagepostinfo">
            <div className="postpagepostinfotabs">
              <i className={`material-icons icnspaceup ${likeState === "like" && "blue-text"}`} onClick={ handleLike }>
                mood
              </i>
              { postLikes || 0 }
              <i className={`material-icons icnspacedown ${likeState === "dislike" && "red-text"}`} onClick={ handleDislike }>
                sentiment_very_dissatisfied
              </i>
            </div>
            { user && (
              <div className="postpagepostinfotabs waves-effect waves-light" onClick={() => handleSavingPost("save")}>
                <i className={`material-icons icnspacesave ${ savedState && "blue-text"}`}>
                  bookmark_outline 
                </i>
                Save
              </div>
            )}
          </div>
          <div className="postpagesortby">
            { postData?.comments.length > 1 && (
              <div className="sortcomments">
                <Patdrop profile={ sortprofile } droppers={ sortdroppers } />
              </div>
            )}
            <div className="postpagesortbytrim"> 
              { postData?.comments.length || 0 } comments 
            </div>
          </div>
          <div className="commentsection">
            <Commentspace postId={ Number(postData?.id) } comments={ postData?.comments } />
          </div>
        </div>
        <div className="contentinfo">
          <Inforecommended />
        </div>
      </div>
    );
  }
}

export default Postpage;