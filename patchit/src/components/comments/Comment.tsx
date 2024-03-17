import React, { useState } from "react";

import { dateFormatter } from "../../common/helpers";

import Commentlist from "./Commentlist"; //component

//css
import "./css/comment.css";
import { commentprops, handleparentidtype } from "./types";

let pic = require("../../img/a.jpg");

const Comments = (commentprops: commentprops) => {
  const { data, childcomments, setNewComment, newComment, setParentComment } = commentprops;

  //state
  const [open, setOpen] = useState<boolean>(true);
  const [expand, setExpand] = useState<boolean>(false);

  //handlers
  const handleOpen: () => void = () => {
    setOpen(!open);
    setExpand(false);
  }

  const handleParentId: handleparentidtype = (parentId: number, parentComment: string) => {
    setNewComment({
      ...newComment,
      parent_id: Number(parentId) 
    })   
    setParentComment({ id: Number(parentId), comment: parentComment });
  }
 
  const rootComments = childcomments && childcomments[data.id];

  return (
    <div className="comment" >
      <div className="commentheader" onClick={ handleOpen }>
        <div className="commentuserpicwrapper">
          <img src={ pic } className="commentuserpic" alt={"user_profile_pic"} />
        </div>
        <div className="commentusername">
          { data?.user_id?.username }
        </div>
        <div className="commenttym">
          { dateFormatter(data?.created_at) }
        </div>
      </div>
      { open && (
        <>
          <div className={`commentcontent ${rootComments !== undefined && "nextcmnt"}`}>
            <div className="commentcontentmsg">
              { data?.comment }
            </div>
            <div className="commentallactions">
              { rootComments !== undefined && (
                <i className="material-icons tiny commentallactionicn blue-text" onClick={() => setExpand(!expand)}>
                  { expand ? "add_circle" : "add_circle_outline" }
                </i>
              )}
              <div className="commentactiontray">
                <div className="commentaction waves-effect waves-light">
                  <i className="material-icons tiny commentactionicn">
                    trending_up
                  </i>
                  0
                </div>
                <div className="commentaction waves-effect waves-light"
                  onClick={ () => handleParentId(data?.id, data?.comment) }
                >
                  Reply
                </div>
              </div>
            </div>
          </div>
          { rootComments !== undefined && (
            <div className="show">
              { expand ? (
                <Commentlist
                  rootcomments={ rootComments }
                  allcomments={ childcomments }
                  setNewComment={ setNewComment }
                  newComment={ newComment }
                  setParentComment={ setParentComment }
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
