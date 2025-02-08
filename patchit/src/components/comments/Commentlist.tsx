import React from "react";

//component
import Comments from "./Comment";
import Zeropostcard from "../cards/Zeropostcard";

//css & types
import "./css/commentlist.css";
import { commentlistprops, commenttype } from "./types";

const Commentlist = (commentlistprops: commentlistprops) => {
  const { rootcomments, allcomments, setCommentState, setError, commentState } = commentlistprops;

  return (
    <div className="allcomments">
      {rootcomments?.length > 0 ? (
        rootcomments?.map((comment: commenttype, idx: number) => (
          <Comments
            key={idx}
            data={comment}
            setError={setError}
            childcomments={allcomments}
            commentState={commentState}
            setCommentState={setCommentState}
          />
        ))
      ) : (
        <Zeropostcard
          title={"No comments done yet!!"}
          openstate={false}
          content={[
            {
              title: "Be first to comment here",
              unlock: "chat_bubble_outline",
              content: "must be logged in to comment"
            }
          ]}
        />
      )}
    </div>
  )
}

export default Commentlist;
