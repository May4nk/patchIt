import React from 'react';
import { Link } from 'react-router-dom';

import { dateFormatter } from '../../utils/helpers';

//css, constants & types
import "./css/postcard.css";
import { postcardpropstype } from './types';
import { defaultCommunityPic } from '../../constants/const';

function Postcard(postcardprops: postcardpropstype) {
  const { post } = postcardprops;

  return (
    <Link to={`/post/${post.id}`} className="postcard">
      <div className="postcardcontent">
        <div className="postcardheader">
          <div className="postcardheaderpicwrapper">
            <img
              alt={"community_pic"}
              className="postcardheaderpic"
              src={post?.community_id?.profile_pic || defaultCommunityPic}
            />
          </div>
          <div className="postcardheadercommunity">
            {post?.community_id?.communityname
              ? `c/${post?.community_id?.communityname}`
              : `u/${post?.owner?.username}`
            }
          </div>
          <div className="postcardheaderposttime">
            . {dateFormatter(post?.created_at)}
          </div>
        </div>
        <div className="postcardbody">
          {post.title}
        </div>
        <div className="postcardfooter">
          {post?.likes} likes .{post?.comments.length} comments
        </div>
      </div>
      {post.type === "IMAGE" && (
        <div className="postcardpicwrapper">
          <img
            alt={"post_pic"}
            className="postcardpic"
            src={JSON.parse(post?.content!)[0].postSrc}
          />
        </div>
      )}
    </Link>
  )
}

export default Postcard;