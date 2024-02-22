import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

//components
import Loadingpage from "../components/Loadingpage";
import Post from "../components/Post";
import Infoabout from "../components/infosection/Infoabout";
import Sortpanel from "../components/Sortpanel";
import Zeropostcard from "../components/Zeropostcard";

//queries
import { GETCOMMUNITY } from "./queries/community";

//css & types
import "./css/main.css";
import "./css/community.css";
import { posttype } from "../types/posttype";
const communitybgpic = require("../img/defaultbgpic.png");
const communitydp = require("../img/a.jpg");

const Community = () => {
  let { cname } = useParams<Record<string, string | undefined>>();

  const [sortby, setSortby] = useState<string>("likes");

  //queries 
  const [getCommunity, { data, loading, error }] = useLazyQuery(GETCOMMUNITY);  
   
  useEffect(() => {
    if(cname){
      getCommunity({
        variables: { 
          "communityname": cname! 
        }
      });
    }
  },[cname]) 

  if (loading) {
    return ( <Loadingpage /> )
  } else if (error) {
    return ( <Loadingpage err={ error.message } /> )
  } else {
    return (
      <>
        <div className="afterprofiletopbar">
          <div className="afterprofilebackground"> 
            <img src={ communitybgpic } className="afterprofilebackgroundpic" alt={"community_bg_pic"}/>
          </div>
          <div className="afterprofileintersection">
            <div className="profileintersectioncontainer">
              <div className="afterprofilepicwrapper"> 
                <img src={ communitydp } className="afterprofilepic" alt={"community_pic"}/> 
              </div>
              <div className="afterprofilename"> 
                <div className="aftername">{ data?.community?.communityname }</div>
                <div className="afterchannelname"> {`c/${data?.community?.communityname}`} </div>
              </div>
            </div>            
            { data?.community?.description && (
              <div className="communityinfo">
                { data?.community?.description }
              </div>
            )}
          </div>
        </div>
        <div className="mycontainerparent">
          <div className="mycontainer">
            <div className="flexy">
              <div className="contentpost">
                { !loading ? (
                  data?.community?.posts.length > 0 ? (
                    <>
                      <div className="postsort">
                        <Sortpanel sort={ sortby } setSort={ setSortby } />
                      </div>
                      { data?.community?.posts.map((post: posttype, idx: number) => (
                        <Post postData={ post } key={ idx } showcommunity={ false }/>
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
          </div>
        </div>
      </>
    );
  }
}

export default Community;
