import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import Loadingpage from "../Loadingpage"; //component

import { GETRECOMMENDEDPOSTS } from "../queries/infosection"; //query

import "./css/inforecommended.css";
import { recommendedposttype } from "./types"; 

let pic: string = require("../../img/a.jpg");

const Inforecommended = () => {     
  const [getRecommend, { data, loading }] = useLazyQuery(GETRECOMMENDEDPOSTS);

  useEffect(() => {
    getRecommend({
      variables: {
        filter: {
          status: "ACTIVE",
          privacy: "PUBLIC"
        },
        limit: 20,
        sort: [{
          order: "desc",
          nulls: "last",
          column: "likes"
        }]
      }
    })  
  },[])

  if(loading) {
    return <Loadingpage />
  } else {
    return (
      <div className="info">
        <div className="recommendedposts">     
          <div className="recommendedposttitle"> 
            recommended post
          </div>
          { data?.listPosts?.map((post: recommendedposttype, idx: number) => (
            <div className="recommendedpost" key={ idx }>
              <div className="recommendedpostheader">
                <div className="recpostheaderpicwrapper">
                  <img src={ pic } className="recpostheaderpic" alt="community_pic" />
                </div>
                { post?.community_id ? (
                  <Link className="recpostheadertitle" to={`/c/${ post?.community_id?.communityname }`}>
                    { post?.community_id.communityname }
                  </Link>
                ) : (
                  <Link className="recpostheadertitle" to={`/u/${ post?.owner.username }`}>
                    u/{ post?.owner.username }
                  </Link>
                )}
                { post?.community_id && (
                  <Link className="recpostheaderuser" to={`/u/${ post?.owner.username }`}>
                    <i className="material-icons tiny recpostheaderusericn"> person_outline </i>
                    { post?.owner.username }
                  </Link>
                ) }
                
              </div>
              <Link to={`/post/${post?.id}`} className="recommendedpostbody">
                { post?.title }
              </Link>
              <div className="recommendedpostfooter">
                <div className="recpostfooterlikes">
                  <i className="material-icons tiny recpostheaderusericn blue-text"> 
                    favorite_border 
                  </i>
                  { post?.likes || 0 }
                </div>
                <div className="recpostfootercmnts">
                  <i className="material-icons tiny recpostheaderusericn red-text">  
                    chat_bubble_outline 
                  </i>
                  { post?.comments.length || 0}
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
