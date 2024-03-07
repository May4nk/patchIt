import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

//components
import Loadingpage from "../components/Loadingpage";
import Post from "../components/Post";
import Sortpanel from "../components/Sortpanel";
import Zeropostcard from "../components/Zeropostcard";
import Infoabout from "../components/infosection/Infoabout";

//queries
import { GETCOMMUNITY } from "./queries/community";

//css & types
import "./css/main.css";
import "./css/community.css";
import { posttype } from "../types/posttype";
const communitydp: string = require(`../img/a.jpg`);  

const Community = () => {
  const { cname } = useParams<Record<string, string>>();
  
  const [sortby, setSortby] = useState<string>("likes");

  //queries
  const [getCommunity, { data, loading, error }] = useLazyQuery(GETCOMMUNITY);  

  useEffect(() => {
    if(cname){
      getCommunity({
        variables: { 
          "communityname": cname! 
        },
      });
    }
  },[cname]) 

  if (loading) {
    return ( <Loadingpage /> )
  } else if (error) {
    return ( <Loadingpage err={ error.message } /> )
  } else {
    return (
      <div className="flexy">
        <div className="contentpost">
          <div className="profileabout">
            <div className="profileintersection">
              <div className="profilepicborder"> 
                <img src={ communitydp } className="profilepic" alt={"community_profilepic"}/> 
              </div>
              <div className="profilename"> 
                <div className="name">{ data?.community?.communityname }</div>
                <div className="channelname"> {`c/${ data?.community?.communityname }`} </div>
              </div>
            </div>
            { data?.community?.description && (
              <div className="communityinfo">
                { data?.community?.description }
              </div>
            )}
          </div>
          { !loading ? (
            data?.community?.posts.length !== 0 ? (
              <>
                <div className="postsort">
                  <Sortpanel sort={ sortby } setSort={ setSortby } />
                </div>
                { data?.community?.posts.map((post: posttype, idx: number) => (
                  <Post postData={ post } key={ idx } showcommunity={ false } />
                ))}
              </> 
            ) : (
              <Zeropostcard title={"No post has been submited in this community yet."}/>                         
            ) 
          ) : (
            <Loadingpage />
          )}
        </div>
        <div className="contentinfo">
          { !loading ? (
            <Infoabout data={ data?.community } userdata={false}/>
          ) : (
            <Loadingpage />
          )}
        </div>
      </div>
    );
  }
}

export default Community;