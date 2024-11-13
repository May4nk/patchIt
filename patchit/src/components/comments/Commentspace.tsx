import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/hooks/useAuth";

//component
import Commentlist from "./Commentlist";

//queries
import { UPSERTCOMMENT } from "./queries";

//css & types
import "./css/commentspace.css";
import { authcontexttype } from "../../context/types";
import { newcommenttype, commenttype, commentspaceprops, parentcommenttype } from "./types";

const Commentspace = (commentspaceprops: commentspaceprops) => {
  const { postId, comments } = commentspaceprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

  //states
  const [addComment, setAddComment] = useState<boolean>(false);
  const [parentComment, setParentComment] = useState<parentcommenttype>();
  const [newComment, setNewComment] = useState<newcommenttype>({
    user_id: userId!,
    post_id: Number(postId),
    parent_id: null,
    comment: ""
  });

  //queries
  const [insertComment] = useMutation(UPSERTCOMMENT);

  //handlers
  const group: Record<number, commenttype[]> = { 0: [] };

  if (comments?.length !== 0) {
    comments?.forEach((comment: commenttype) => {
      if (comment.parent_id === null) {
        group[0].push(comment);
      } else {
        group[comment?.parent_id?.id] ||= [];
        group[comment?.parent_id?.id].push(comment);
      }
    })
  }

  const handleComment: (e: any) => void = (e) => {
    setNewComment({
      ...newComment,
      [e.target.name]: e.target.value
    })
  }

  const handleAddComment: (e: any) => Promise<void> = async (e) => {
    e.preventDefault();
    if (newComment.comment.length !== 0) {
      await insertComment({
        variables: {
          data: newComment
        },
        onCompleted: () => {
          if (newComment?.parent_id) {
            const parentComment = document.getElementById(`comment${newComment.parent_id}`);
            if (parentComment) {
              parentComment.scrollIntoView({ behavior: "smooth" });
            }
          }
          setNewComment({ user_id: userId!, post_id: Number(postId), parent_id: null, comment: "" });
          setParentComment({ id: 0, comment: "" });
          setAddComment(!addComment);
        }
      })
    }
  }

  const handleCommentSection: () => void = () => {
    if (user) {
      setNewComment({ user_id: userId!, post_id: Number(postId), parent_id: null, comment: "" });
      setParentComment({ id: 0, comment: "" });
      setAddComment(!addComment);
    } else {
      navigate("/account/login");
    }
  }

  useEffect(() => {
    if (newComment.parent_id !== null) {
      setAddComment(true);
    }
  }, [newComment.parent_id]);

  return (
    <div className="commentspace">
      {!addComment && (
        <div className="commentspaceadd waves-effect waves-light" onClick={handleCommentSection}>
          <i className="material-icons commentspaceaddicn"> add </i>
          Comment
        </div>
      )}
      {addComment && (
        <div className="newcommentwrapper">
          {newComment.parent_id !== null && (
            <div className="parentComment">
              <i className="material-icons tiny"> reply </i>
              <div className="parentcommenttxt">
                {parentComment && parentComment?.comment.length > 88
                  ? `${parentComment?.comment.substring(0, 88)}...`
                  : parentComment?.comment
                }
              </div>
            </div>
          )}
          <textarea
            name="comment"
            className="newcomment"
            placeholder="Add a comment..."
            onChange={handleComment}
            id={"replycomment"}
            value={newComment.comment}
          ></textarea>
          <div className="newcommentaction">
            <div className="newcommentactionbtnpost waves-effect waves-light" onClick={handleAddComment}>
              Post
            </div>
            <div className="newcommentactionbtncancel waves-effect waves-light" onClick={handleCommentSection}>
              cancel
            </div>
          </div>
        </div>
      )}
      <Commentlist
        allcomments={group}
        newComment={newComment}
        setNewComment={setNewComment}
        rootcomments={group[0].reverse()}
        setParentComment={setParentComment}
      />
    </div>
  )
}

export default Commentspace;
