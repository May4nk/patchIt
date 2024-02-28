import React from "react";

//component
import Comments from "./Comment";
import Zeropostcard from "../Zeropostcard";

//css
import "./css/commentlist.css";
import { commentlistprops } from "./types";

const Commentlist = (commentlistprops: commentlistprops) => {
  const { rootcomments, allcomments, setNewComment, newComment, setParentComment } = commentlistprops;

  return (
    <div className="allcomments">
      { rootcomments?.length > 0 ? (
        rootcomments?.map((comment: any, idx: number) => (
          <Comments
            data={ comment }
            key={ idx }
            childcomments={ allcomments }
            setNewComment={ setNewComment }
            newComment={ newComment }
            setParentComment={ setParentComment }
          />
        ))
      ) : (
        <Zeropostcard
          title={ "No comments done yet!!" }
          openstate={ false }
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
