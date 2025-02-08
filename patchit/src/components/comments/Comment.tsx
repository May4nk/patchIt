import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

//utils
import { useAuth } from "../../utils/hooks/useAuth";
import { getSignedUrls } from "../../utils/services/s3";
import { dateFormatter, defaultUPic } from "../../utils/helpers/helpers";

//component
import Patbtn from "../html/Patbtn";
import Commentlist from "./Commentlist";

//queries
import { INSERTUSERCOMMENTLIKE, LISTUSERCOMMENTLIKES, UPSERTCOMMENT } from "./queries";

//css, constants & types
import "./css/comment.css";
import { signedurltype } from "../../utils/types";
import { authcontexttype } from "../../context/types";
import { defaultUserPic } from "../../constants/const";
import { ASYNCVOIDFUNC, USER_S_N_TYPE, VOIDFUNC } from "../../utils/main/types";
import { commentprops, handleparentidtype, listusercommentliketype } from "./types";

const Comments = (commentprops: commentprops) => {
  const { data, childcomments, commentState, setError, setCommentState } = commentprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

  //queries
  const [updateComment] = useMutation(UPSERTCOMMENT);
  const [getUserCommentLikes] = useLazyQuery(LISTUSERCOMMENTLIKES);
  const [insertUserCommentLike] = useMutation(INSERTUSERCOMMENTLIKE);

  //states
  const [userProfile, setUserProfile] = useState<USER_S_N_TYPE>(null);
  const [showThread, setShowThread] = useState<boolean>(false);
  const [openCmnt, setOpenCmnt] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);

  //handlers  
  const handleOpen: VOIDFUNC = () => {
    setOpenCmnt(prev => !prev);
    setShowThread(false);
  }

  const handleExpand: VOIDFUNC = () => {
    setShowThread(prev => !prev);
    setOpenCmnt(true);
  }

  const handleCommentLike: ASYNCVOIDFUNC = async () => {
    if (!user) (navigate("/account/login"));

    const commentLikes: number = liked ? likes - 1 : likes + 1;
    try {
      await updateComment({
        variables: {
          data: {
            id: data?.id,
            likes: commentLikes,
          }
        },
        onCompleted: async () => {
          await insertUserCommentLike({
            variables: {
              data: {
                user_id: userId,
                comment_id: data?.id
              }
            },
            onCompleted: () => {
              setLikes(commentLikes);
              setLiked(prev => !prev);
            }
          });
        }
      });
    } catch (err) {
      setError({ show: true, status: 500, message: "Try again: Something went wrong..." })
    }
  }

  const handleParentId: handleparentidtype = (parentId: string, parentComment: string) => {
    setCommentState({ type: "NEW_COMMENT", comment: { parent_id: parentId } });
    setCommentState({ type: "ADD_PARENT_COMMENT", comment: { id: parentId, text: parentComment } });

    const replySection = document.getElementById("comments");
    if (replySection) {
      replySection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const rootComments = childcomments && childcomments[data.id];

  useEffect(() => {
    if (data) {
      setLikes(data?.likes);

      const userPic = data?.user_id?.profile_pic;
      if (userPic !== null && userPic.length > 0) {
        (async function () {
          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: data?.user_id?.id,
            postId: "0",
            req: "GET",
            files: [{ name: userPic }]
          });

          setUserProfile(signedUrls[0].signedUrl)
        }());
      }
    }

    if (userId) {
      getUserCommentLikes({
        variables: {
          filter: {
            user_id: userId
          }
        },
        onCompleted: ({ listUserCommentLikes }: { listUserCommentLikes: listusercommentliketype[] }) => {
          if (listUserCommentLikes) {
            const userLikedComment: listusercommentliketype[] = listUserCommentLikes.filter(
              (usercommentlike: listusercommentliketype) => (
                usercommentlike.comment_id.id === data?.id
              )
            );

            if (userLikedComment.length > 0) {
              setLiked(true);
            } else {
              setLiked(false);
            }
          }
        }
      });
    } else {
      setLiked(false);
    }
  }, [data, userId]);

  return (
    <div className="comment" id={`comment${data?.id}`} >
      <div className="commentheader" onClick={handleOpen}>
        <div className="commentuserpicwrapper">
          <img
            onError={defaultUPic}
            alt={"user_profile_pic"}
            className="commentuserpic"
            src={userProfile || defaultUserPic}
          />
        </div>
        {data?.user_id?.status === "ACTIVE" ? (
          <Link to={`/u/${data?.user_id?.username}`} className="commentusername">
            {data?.user_id?.username}
          </Link>
        ) : (
          <div className="commentdelusername"> deleted </div>
        )}
        {openCmnt && (
          <div className="commenttym"> {dateFormatter(data?.created_at)} </div>
        )}
        {!openCmnt && (
          <div className="commenttext">
            {data?.text.length > 100 ? `${data?.text.substring(0, 100)}...` : data?.text}
          </div>
        )}
      </div>
      {openCmnt && (
        <>
          <div className={`commentcontent ${rootComments !== undefined && "nextcmnt"}`}>
            <div className="commentcontentmsg">
              {data?.text}
            </div>
            <div className="commentallactions">
              {rootComments !== undefined && (
                <i
                  onClick={handleExpand}
                  className="material-icons tiny commentallactionicn blue-text"
                >
                  {showThread ? "add_circle" : "add_circle_outline"}
                </i>
              )}
              <div className="commentactiontray">
                <Patbtn
                  size="small"
                  text={`${likes}`}
                  icn={"trending_up"}
                  state={liked ? "selected" : "inactive"}
                  handleClick={handleCommentLike}
                />
                <Patbtn
                  text={"reply"}
                  size="small"
                  handleClick={() => handleParentId(data?.id, data?.text)}
                />
                {/* <div
                  className="commentaction waves-effect waves-light"
                  onClick={() => handleParentId(data?.id, data?.text)}
                >
                  Reply
                </div> */}
              </div>
            </div>
          </div>
          {rootComments !== undefined && (
            <div className="show">
              {showThread ? (
                <Commentlist
                  setError={setError}
                  rootcomments={rootComments}
                  allcomments={childcomments}
                  commentState={commentState}
                  setCommentState={setCommentState}
                />
              ) : (
                <div className="more" onClick={handleExpand}>
                  show replies
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Comments;
