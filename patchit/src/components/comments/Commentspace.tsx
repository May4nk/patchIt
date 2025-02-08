import React, { useEffect, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/hooks/useAuth";

//component
import Patbtn from "../html/Patbtn";
import Commentlist from "./Commentlist";

//queries
import { UPSERTCOMMENT } from "./queries";

//css & types
import "./css/commentspace.css";
import { authcontexttype } from "../../context/types";
import { ASYNCVOIDFUNC, USER_S_N_TYPE, VOIDFUNC } from "../../utils/main/types";
import { commenttype, commentspaceprops, commentstatetype, commentstateactiontype, handlecommentstatetype } from "./types";

const Commentspace = (commentspaceprops: commentspaceprops) => {
  const { postId, comments, setError } = commentspaceprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

  //states
  const commentInitState: commentstatetype = {
    addComment: false,
    parentComment: null,
    newComment: {
      user_id: userId!,
      post_id: postId,
      parent_id: null,
      text: ""
    }
  }

  const handleCommentState: handlecommentstatetype = (state: commentstatetype, action: commentstateactiontype) => {
    switch (action.type) {
      case "ADD_COMMENT":
        return { ...state, addComment: action.addComment };

      case "NEW_COMMENT":
        return {
          ...state,
          addComment: true,
          newComment: {
            ...state.newComment,
            ...action.comment
          }
        };

      case "ADD_PARENT_COMMENT":
        return { ...state, parentComment: action.comment };

      case "RESET":
        return commentInitState;

      default:
        return state;
    }
  }

  const [commentState, dispatch] = useReducer(handleCommentState, commentInitState);

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

  const handleComment: VOIDFUNC = (e) => {
    dispatch({ type: "NEW_COMMENT", comment: { [e.target.name]: e.target.value } });
  }

  const handleAddComment: ASYNCVOIDFUNC = async (e: any) => {
    e.preventDefault();
    if (commentState?.newComment.text.length !== 0) {
      try {
        await insertComment({
          variables: {
            data: commentState?.newComment
          },
          onCompleted: () => {
            if (commentState?.newComment?.parent_id) {
              const parentComment = document.getElementById(`comment${commentState?.newComment.parent_id}`);
              if (parentComment) {
                parentComment.scrollIntoView({ behavior: "smooth" });
              }
            }
            dispatch({ type: "RESET" });
          }
        })
      } catch (err) {
        setError({ show: true, status: 500, message: "Try again: Something went wrong..." })
      }
    }
  }

  const handleCommentSection: VOIDFUNC = () => {
    if (userId) {
      dispatch({
        type: "NEW_COMMENT",
        comment: {
          user_id: userId,
          post_id: postId
        }
      });
    } else {
      navigate("/account/login");
    }
  }

  useEffect(() => {
    if (commentState?.newComment.parent_id !== null) {
      dispatch({ type: "ADD_COMMENT", addComment: true });
    }
  }, [commentState?.newComment.parent_id]);

  return (
    <div className="commentspace">
      {!commentState.addComment && (
        <Patbtn
          icn={"add"}
          size={"big"}
          text={"comment"}
          handleClick={handleCommentSection}
        />
      )}
      {commentState.addComment && (
        <div className="newcommentwrapper">
          {commentState?.newComment.parent_id !== null && (
            <div className="parentComment">
              <i className="material-icons tiny"> reply </i>
              <div className="parentcommenttxt">
                {commentState?.parentComment && commentState?.parentComment?.text.length > 88
                  ? `${commentState?.parentComment?.text.substring(0, 88)}...`
                  : commentState?.parentComment?.text
                }
              </div>
            </div>
          )}
          <textarea
            name="text"
            className="newcomment"
            placeholder="Add a comment..."
            onChange={handleComment}
            id={"replycomment"}
            value={commentState?.newComment.text}
          ></textarea>
          <div className="newcommentaction">
            <Patbtn
              text={"post"}
              size={"small"}
              state={"selected"}
              handleClick={handleAddComment}
            />
            <Patbtn
              text={"cancel"}
              state={"clear"}
              size={"small"}
              handleClick={() => dispatch({ type: "ADD_COMMENT", addComment: false })}
            />
          </div>
        </div>
      )}
      <Commentlist
        allcomments={group}
        setError={setError}
        setCommentState={dispatch}
        commentState={commentState}
        rootcomments={group[0].reverse()}
      />
    </div>
  )
}

export default Commentspace;
