import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../common/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import Commentlist from "./Commentlist"; //component

import { UPSERTCOMMENT } from "./queries"; //queries

//css
import "./css/commentspace.css";
import { authcontexttype } from "../../context/types";
import { newcommenttype, commenttype, commentspaceprops, } from "./types";

interface parentcommenttype {
  id: number;
  comment: string;
}

const Commentspace = (commentspaceprops: commentspaceprops) => {
  const { postId, comments } = commentspaceprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: number|null = user && Number(user["id"] || user["user_id"]);

  const [addComment, setAddComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<newcommenttype>({ user_id: userId!, post_id: Number(postId), parent_id: null, comment: "" });
  const [parentComment, setParentComment] = useState<parentcommenttype>();

  const [insertComment] = useMutation(UPSERTCOMMENT);

  const group:Record<number, commenttype[]> = { 0: []};
  
  if(comments?.length !== 0) {
    comments?.forEach((comment: any) => {
      if(comment.parent_id === null ) {     
        group[0].push(comment);
      } else {
        group[comment?.parent_id?.id] ||= [];
        group[comment.parent_id.id].push(comment);
      }
    })
  }
  
  //handlers
  const handleComment: (e: any) => void = (e) => {
    setNewComment({
      ...newComment,
      [e.target.name]: e.target.value
    })
  }

  const handleAddComment: (e: any) => void = (e) => {
    e.preventDefault();  
    if(newComment.comment.length !== 0) {   
      insertComment({
        variables: {
          data: newComment
        },
        onCompleted: () => {
          setNewComment({ user_id: userId!, post_id: Number(postId), parent_id: null, comment: "" });
          setParentComment({ id: 0, comment: ""});
          setAddComment(!addComment);
        }
      })
    }
  }

  const handleCommentSection: () => void = () => {
    if(user) {
      setNewComment({ user_id: userId!, post_id: Number(postId), parent_id: null, comment: "" });
      setParentComment({ id: 0, comment: ""});
      setAddComment(!addComment);     
    } else {
      navigate("/account/login");
    }
  }
  
  useEffect(() => {
    if(newComment.parent_id !== null) {
      setAddComment(true);
    }
  }, [newComment.parent_id]);
 
  return (
    <div className="commentspace">
      {!addComment && (
        <div className="commentspaceadd waves-effect waves-light" onClick={ handleCommentSection }>  
        <i className="material-icons commentspaceaddicn"> add </i>
        Comment
      </div>    
      )}      
      { addComment && (      
        <div className="newcommentwrapper">
          { newComment.parent_id !== null && (
            <div className="parentComment">
              <i className="material-icons tiny"> reply </i>
              <div className="parentcommenttxt">{ parentComment?.comment }</div>
            </div>
          )}
          <textarea className="newcomment" placeholder="Add a comment..." name="comment" onChange={ handleComment } value={ newComment.comment }></textarea>
          <div className="newcommentaction">
            <div className="newcommentactionbtnpost waves-effect waves-light" onClick={ handleAddComment }>
              Post
            </div>
            <div className="newcommentactionbtncancel waves-effect waves-light" onClick={ handleCommentSection }>
              cancel
            </div>
          </div>
        </div>
      )}
      <Commentlist 
        rootcomments={ group[0] } 
        allcomments={ group } 
        setNewComment={ setNewComment } 
        newComment={ newComment } 
        setParentComment={ setParentComment }
      />
    </div>
  )
}

export default Commentspace;
