import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//component
import Loadingpage from "../Loadingpage";

//query
import { GETRECOMMENDEDPOSTS } from "../queries/infosection";

//css & types
import "./css/inforecommended.css";
import { recommendedposttype } from "./types";
import { defaultCommunityPic, defaultUserPic } from "../../constants/const";

const Inforecommended = () => {

  const [getRecommend, { data, loading }] = useLazyQuery(GETRECOMMENDEDPOSTS);

  //handlers
  useEffect(() => {
    getRecommend({
      variables: {
        filter: {
          status: "ACTIVE",
          privacy: "PUBLIC"
        },
        sort: [{
          order: "desc",
          nulls: "last",
          column: "likes"
        }],
        limit: 20,
      }
    })
  }, [])

  if (loading) {
    return <Loadingpage />
  } else {
    return (
      <div className="info">
        <div className="recommendedposts">
          <div className="recommendedposttitle">
            recommended post
          </div>
          {data?.listPosts?.map((post: recommendedposttype, idx: number) => (
            <div className="recommendedpost" key={idx}>
              <div className="recommendedpostheader">
                <div className="recpostheaderpicwrapper">
                  <img
                    className="recpostheaderpic"
                    alt="community_pic"
                    src={post?.community_id
                      ? post?.community_id?.profile_pic || defaultCommunityPic
                      : post?.owner?.profile_pic || defaultUserPic
                    }
                  />
                </div>
                {post?.community_id ? (
                  <Link className="recpostheadertitle" to={`/c/${post?.community_id?.communityname}`}>
                    {post?.community_id.communityname}
                  </Link>
                ) : (
                  post?.owner?.status === "ACTIVE" ? (
                    <Link className="recpostheadertitle" to={`/u/${post?.owner.username}`}>
                      u/{post?.owner.username}
                    </Link>
                  ) : (
                    <div className="recpostheadertitle">
                      deleted
                    </div>
                  )
                )}
                {post?.community_id && (
                  post?.owner?.status === "ACTIVE" ? (
                    <Link className="recpostheaderuser" to={`/u/${post?.owner.username}`}>
                      <i className="material-icons tiny recpostheaderusericn"> person_outline </i>
                      {post?.owner.username}
                    </Link>
                  ) : (
                    <div className="recpostheaderdeluser">
                      <i className="material-icons tiny recpostheaderusericn"> person_outline </i>
                      deleted
                    </div>
                  )
                )}
              </div>
              <Link to={`/post/${post?.id}`} className="recommendedpostbody">
                {post?.title.length > 45 ? post?.title.substring(0, 45) + "..." : post?.title}
              </Link>
              <div className="recommendedpostfooter">
                <div className="recpostfooterlikes">
                  <i className="material-icons tiny recpostheaderusericn blue-text">
                    favorite_border
                  </i>
                  {post?.likes || 0}
                </div>
                <div className="recpostfootercmnts">
                  <i className="material-icons tiny recpostheaderusericn red-text">
                    chat_bubble_outline
                  </i>
                  {post?.comments.length || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Inforecommended;
