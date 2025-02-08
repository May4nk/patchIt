import React from 'react';
import { Link } from 'react-router-dom';

//utils
import { dateFormatter, defaultUPic } from '../../utils/helpers/helpers';

//css, constants & types
import "./css/commentcard.css";
import { commentcardpropstype } from './types';
import { defaultCommunityPic } from '../../constants/const';

function Commentcard(commentcardprops: commentcardpropstype) {
  const { comment, extend } = commentcardprops;

  return (
    <div className="commentcard">
      <div className="commentcardpost">
        <div className="commentcardpostpicwrapper">
          <img
            alt={"comment_ppic"}
            className="commentcardpostpic"
            src={comment?.post_id?.community_id
              ? (comment?.post_id?.community_id?.profile_pic || defaultCommunityPic)
              : (comment?.user_id?.profile_pic)
            }
            onError={defaultUPic}
          />
        </div>
        {comment?.post_id?.community_id
          ? (
            <Link
              className="commentcardcommunityname"
              to={`/c/${comment?.post_id?.community_id?.name}`}
            >
              c/{comment?.post_id?.community_id?.name}
            </Link>
          ) : (
            comment?.user_id?.status === "ACTIVE" ? (
              <Link
                className="commentcardcommunityname"
                to={`/u/${comment?.user_id?.username}`}
              >
                u/{comment?.user_id?.username}
              </Link>
            ) : (
              <div className="commentcardcommunityname">
                deleted
              </div>
            )
          )
        }
        {dateFormatter(comment?.post_id?.created_at)}
      </div>
      <Link to={`/post/${comment?.post_id?.id}`} className="commentcardposttitle">
        {comment?.post_id?.title}
      </Link>
      <div className="cmntoverviewcontent">
        {extend && comment?.parent_id ? (
          <>
            <div className="parentcmnt">
              <div className="parentcmntheader">
                <div className="parentcmntpicwrapper">
                  <img
                    src={comment?.user_id?.profile_pic}
                    className="parentcmntpic"
                    alt={"user_pic"}
                    onError={defaultUPic}
                  />
                </div>
                {comment?.user_id?.status === "ACTIVE" ? (
                  <Link to={`/u/${comment?.user_id?.username}`} className="cmntheaderusername">
                    u/{comment?.user_id?.username}
                  </Link>
                ) : (
                  <div className="cmntheaderusername">
                    deleted
                  </div>
                )}
                <div className="parentcmntcreated">
                  replied
                </div>
                {comment?.parent_id?.user_id?.status === "ACTIVE" ? (
                  <Link to={`/u/${comment?.parent_id?.user_id.username}`} className="cmntheaderreplyusername">
                    u/{comment?.parent_id?.user_id.username}
                  </Link>
                ) : (
                  <div className="cmntheaderreplyusername">
                    deleted
                  </div>
                )}
                <div className="parentcmntcreated">
                  {dateFormatter(comment?.created_at)}
                </div>
              </div>
              <div className="parentcmnttxt">
                {comment?.parent_id?.text}
              </div>
            </div>
            <Link to={`/post/${comment?.post_id?.id}/#comment${comment?.id}`} className="cmntoverviewmetacontent">
              {comment?.text}
            </Link>
          </>
        ) : (
          <>
            <div className="cmntheader">
              <div className="cmntpicwrapper">
                <img
                  src={comment?.user_id?.profile_pic}
                  alt="user pic"
                  className="cmntpic"
                  onError={defaultUPic}
                />
              </div>
              {comment?.user_id?.status === "ACTIVE" ? (
                <Link to={`/u/${comment?.user_id?.username}`} className="cmntheaderusername">
                  u/{comment?.user_id?.username}
                </Link>
              ) : (
                <div className="cmntheaderusername">
                  deleted
                </div>
              )}
              <div className="parentcmntcreated">
                {extend && "commented"} {dateFormatter(comment?.created_at)}
              </div>
            </div>
            <Link to={`/post/${comment?.post_id?.id}/#comment${comment?.id}`} className="commenttxt">
              {comment.text}
            </Link>
          </>
        )}
      </div>
    </div>
  )
};

Commentcard.defaultProps = {
  extend: false
}

export default Commentcard;
