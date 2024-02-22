import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";

//components
import Loadingpage from "../components/Loadingpage";
import Post from "../components/Post";
import Infosection from "../components/infosection/Info";
import Popularpagecard from "../components/Popularpagecard";
import Sortpanel from "../components/Sortpanel";

//queries
import { GETALLPOSTS } from "./queries/common";
import { GETPOPULARCARDPOSTS } from "./queries/popular";

//css
import "./css/main.css";
import "./css/popular.css";
import { popularcardtype } from "./types/popular";
import { posttype } from "../types/posttype";

const Popular = () => {  
  const [sortby, setSortby] = useState<string>("likes");
 
  const [getPopularPosts, { data: popularPostsData, loading: popularPostsLoading }] = useLazyQuery(GETALLPOSTS);

  const { data: cardPostsData, loading: cardPostsLoading } = useQuery(GETPOPULARCARDPOSTS, {
    variables: {     
      sort: [
        {
          column: "likes",
          nulls: "last",
          order: "desc"
        }
      ],
      limit: 4,
      filter: {        
        status: "ACTIVE",
        privacy: "PUBLIC"
      }
    }
  });

  useEffect(() => {
    getPopularPosts({
      variables: {
        "sort": [
          {
            "column": sortby,
            "nulls": "last",
            "order": "desc"
          }
        ],    
        filter: {      
          privacy: "PUBLIC",
          status: "ACTIVE"
        }
      }
    });
  }, [sortby]);

  if (cardPostsLoading) {
    return ( <Loadingpage /> )
  } else {
    return (
      <>
        <div className="contenttitle"> Trending </div>
        <div className="contentfilter">
          { cardPostsData?.listPosts?.map((post: popularcardtype, idx: number) => (
            <Popularpagecard data={ post } key={ idx }/>
          ))}
        </div>
        <div className="contenttitle">Popular</div>
        <div className="flexy">
          <div className="contentpost">
            <div className="postsort">
              <Sortpanel sort={ sortby } setSort={ setSortby } />
            </div>
            { !popularPostsLoading ? (
              popularPostsData?.listPosts?.map((post: posttype, idx: number) => (              
                <Post postData={ post } key={ idx } showcommunity={ post.community_id === null ? false : true } />
              ))) : (
                <Loadingpage />
              )
            } 
          </div>
          <div className="contentinfo">
            <Infosection />
          </div>
        </div>
      </>
    );
  }
}

export default Popular;
