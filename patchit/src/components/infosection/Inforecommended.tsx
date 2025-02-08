import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//utils
import { getSignedUrls } from "../../utils/services/s3";

//component
import Loadingpage from "../Loadingpage";

//query
import { GETRECOMMENDEDPOSTS } from "../queries/infosection";

//css & types
import "./css/inforecommended.css";
import { recommendedposttype } from "./types";
import { signedurltype } from "../../utils/types";
import { USER_S_N_TYPE } from "../../utils/main/types";
import { defaultCPic, defaultUPic } from "../../utils/helpers/helpers";
import { defaultCommunityPic, defaultUserPic } from "../../constants/const";

const Inforecommended = () => {
  //states
  const [communityPics, setCommunityPics] = useState<{ [key: string]: string | null }>({});

  //queries
  const [getRecommend, { data, loading }] = useLazyQuery(GETRECOMMENDEDPOSTS);

  //handlers
  const getSignedPicOfCommunties = async (post: recommendedposttype) => {
    const user_pic: USER_S_N_TYPE = post?.owner.profile_pic;
    const community_pic: USER_S_N_TYPE = post?.community_id?.profile_pic;

    if (user_pic || community_pic) {
      if (post?.community_id) {
        if (community_pic !== null && community_pic.length > 0) {
          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: post?.community_id?.owner.id,
            postId: "0",
            req: "GET",
            files: [{ name: community_pic }]
          });

          setCommunityPics(prev => ({
            ...prev,
            [post?.community_id?.id]: signedUrls[0].signedUrl
          }));
        } else {
          setCommunityPics(prev => ({
            ...prev,
            [post?.community_id?.id]: null
          }));
        }
      } else {
        if (user_pic !== null && user_pic.length > 0) {
          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: post?.owner.id,
            postId: "0",
            req: "GET",
            files: [{ name: user_pic }]
          });

          setCommunityPics(prev => ({
            ...prev,
            [post?.owner.id]: signedUrls[0].signedUrl
          }));

        } else {
          setCommunityPics(prev => ({
            ...prev,
            [post?.owner.id]: null
          }));
        }
      }
    }
  }

  useEffect(() => {
    getRecommend({
      variables: {
        filter: {
          status: "ACTIVE",
        },
        sort: [{
          order: "desc",
          nulls: "last",
          column: "likes"
        }],
        limit: 15,
      },
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      data?.listPosts?.forEach(async (post: recommendedposttype) => {
        await getSignedPicOfCommunties(post)
      })

    }
  }, [data, loading])

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
                    onError={post?.community_id ? defaultCPic : defaultUPic}
                    src={post?.community_id
                      ? communityPics[post?.community_id?.id] || defaultCommunityPic
                      : communityPics[post?.owner?.profile_pic] || defaultUserPic
                    }
                  />
                </div>
                {post?.community_id ? (
                  <Link className="recpostheadertitle" to={`/c/${post?.community_id?.name}`}>
                    {post?.community_id.name}
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
