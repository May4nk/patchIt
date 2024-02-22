import React from "react";

import { supostprops } from "../types";

const Supost = (supostprops: supostprops) => {
  const { post } = supostprops;

  return (
    <div className="suposts">
      <div className="supostheader">
        <span className="commandusername">
          c/{ post?.community_id?.communityname }
        </span>
        by
        <span className="commandusername">
          u/{ post?.owner?.username }
        </span>
      </div>
      <div className="supoststitle">{post?.title}</div>
      <div className="supostcontent">
        { post?.type === "image" ? (
          <img src={require(`../../img/${JSON.parse(post?.content)[0].postSrc}`)} alt="pic" className="supostcontentpic" />
        ) : post?.type === "blog" ? (
          post.content
        ) : post?.type === "link" && (
          <div className="blue-text"> { post?.content } </div>
        )}
      </div>
      <div className="supostfooter">
        <div className="supostfooterlikes">
          { post?.likes ?? 0 }
          <i className="blue-text material-icons tiny supostfootericn"> thumbs_up_down </i>
        </div>
      </div>
    </div>
  );
}

export default Supost;