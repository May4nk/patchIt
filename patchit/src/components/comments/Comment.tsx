import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import { useAuth } from "../../utils/hooks/useAuth";
import { dateFormatter, defaultUPic } from "../../utils/helpers";

//component
import Commentlist from "./Commentlist";

//queries
import { INSERTUSERCOMMENTLIKE, LISTUSERCOMMENTLIKES, UPSERTCOMMENT } from "./queries";

//css & types
import "./css/comment.css";
import { authcontexttype } from "../../context/types";
import { commentprops, handleparentidtype, listusercommentliketype } from "./types";

const Comments = (commentprops: commentprops) => {
  const { data, childcomments, setNewComment, newComment, setParentComment } = commentprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

  //state
  const [open, setOpen] = useState<boolean>(true);
  const [expand, setExpand] = useState<boolean>(false);
  const [commentLikes, setCommentLikes] = useState<number>(0);
  const [commentLiked, setCommentLiked] = useState<boolean>(false);

  //queries
  const [updateComment] = useMutation(UPSERTCOMMENT);
  const [insertUserCommentLike] = useMutation(INSERTUSERCOMMENTLIKE);
  const [getUserCommentLikes] = useLazyQuery(LISTUSERCOMMENTLIKES);

  //handlers  
  const handleOpen: () => void = () => {
    setOpen(!open);
    setExpand(false);
  }

  const handleCommentLike: () => Promise<void> = async () => {
    if (!user) {
      navigate("/account/login");
      return;
    }

    try {
      await updateComment({
        variables: {
          data: {
            id: data?.id,
            likes: commentLiked ? commentLikes - 1 : commentLikes + 1,
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
              setCommentLikes(commentLiked ? commentLikes - 1 : commentLikes + 1);
              setCommentLiked(commentLiked ? false : true);
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleParentId: handleparentidtype = (parentId: number, parentComment: string) => {
    setNewComment({ ...newComment, parent_id: Number(parentId) });
    setParentComment({ id: Number(parentId), comment: parentComment });

    const replySection = document.getElementById("comments");

    if (replySection) {
      replySection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const rootComments = childcomments && childcomments[data.id];

  useEffect(() => {
    if (data) {
      setCommentLikes(data?.likes);
    }
  }, [data]);

  useEffect(() => {
    if (userId) {
      getUserCommentLikes({
        variables: {
          filter: {
            user_id: userId
          }
        },
        onCompleted: ({ listUserCommentLikes }: { listUserCommentLikes: listusercommentliketype[] }) => {
          if (listUserCommentLikes) {
            const userLikedComment: listusercommentliketype | undefined = listUserCommentLikes.find(
              (usercommentlike: listusercommentliketype) => (
                usercommentlike.comment_id.id === data?.id
              )
            );

            if (userLikedComment) {
              setCommentLiked(true);
            } else {
              setCommentLiked(false);
            }
          }
        }
      });
      setCommentLiked(false);
    } else {
      setCommentLiked(false);
    }
  }, [userId])

  return (
    <div className="comment" id={`comment${data?.id}`} >
      <div className="commentheader" onClick={handleOpen}>
        <div className="commentuserpicwrapper">
          <img
            className="commentuserpic"
            alt={"user_profile_pic"}
            src={data?.user_id?.profile_pic}
            onError={defaultUPic}
          />
        </div>
        {data?.user_id?.status === "ACTIVE" ? (
          <Link to={`/u/${data?.user_id?.username}`} className="commentusername">
            {data?.user_id?.username}
          </Link>
        ) : (
          <div className="commentdelusername">
            deleted
          </div>
        )}
        <div className="commenttym">
          {dateFormatter(data?.created_at)}
        </div>
      </div>
      {open && (
        <>
          <div className={`commentcontent ${rootComments !== undefined && "nextcmnt"}`}>
            <div className="commentcontentmsg">
              {data?.comment}
            </div>
            <div className="commentallactions">
              {rootComments !== undefined && (
                <i className="material-icons tiny commentallactionicn blue-text" onClick={() => setExpand(!expand)}>
                  {expand ? "add_circle" : "add_circle_outline"}
                </i>
              )}
              <div className="commentactiontray">
                <div className="commentaction waves-effect waves-light" onClick={handleCommentLike}>
                  <i className={`material-icons tiny commentactionicn ${commentLiked && "blue-text"}`}>
                    trending_up
                  </i>
                  {commentLikes}
                </div>
                <div className="commentaction waves-effect waves-light"
                  onClick={() => handleParentId(data?.id, data?.comment)}
                >
                  Reply
                </div>
              </div>
            </div>
          </div>
          {rootComments !== undefined && (
            <div className="show">
              {expand ? (
                <Commentlist
                  rootcomments={rootComments}
                  allcomments={childcomments}
                  setNewComment={setNewComment}
                  newComment={newComment}
                  setParentComment={setParentComment}
                />
              ) : (
                <div className="more" onClick={() => setExpand(!expand)}>
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
