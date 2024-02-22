import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useAuth } from "../common/hooks/useAuth";

//components
import Loadingpage from "../components/Loadingpage";
import Post from "../components/Post";
import Sortpanel from "../components/Sortpanel";
import Infosection from "../components/infosection/Info";

//queries
import { GETALLPOSTS } from "./queries/common";
import { GETALLPOSTFORHOME } from "./queries/home";

//css & types
import "./css/main.css";
import { posttype } from "../types/posttype";
import { authcontexttype } from "../context/types";

const Home = () => {
  const { user }: authcontexttype = useAuth();
  const userId: number|null = user && Number(user["id"] || user["user_id"]);
  
  const [sortby, setSortby] = useState<string>("created_at");
  
  //queries
  const [getPostsForHome, { data: homePostData, loading: homePostLoading }] = useLazyQuery(GETALLPOSTFORHOME);  
  const [ getPosts , { data: postData, loading: postLoading }] = useLazyQuery(GETALLPOSTS);

  const pdata = userId !== null
    ? !homePostLoading && homePostData?.listUsersCommunity.map((posts: any) => posts.community_id?.posts).flat(1)
    : !postLoading && postData?.listPosts;
  
  useEffect(() => {
    if(userId !== null) {
      getPostsForHome({
        variables: {          
          filter: {
            user_id: userId!,
          }          
        }
      })
    } else {
      getPosts({
        variables: {
          sort: [
            {
              column: sortby,
              nulls: "last",
              order: "desc"
            }
          ],
          filter: {            
            status: "ACTIVE",
            privacy: "PUBLIC"      
          } 
        }
      })
    }
  }, [userId, sortby])

  if(postLoading || homePostLoading) {  
    return  <Loadingpage />   
  } else {
    return (
      <>
        <div className="flexy">
          <div className="contentpost">
            <div className="postsort">
              <Sortpanel sort={ sortby } setSort={ setSortby } />
            </div>
            { pdata?.map((post: posttype, idx: number) => (              
              <Post postData={ post } key={ idx } showcommunity={ post.community_id === null? false: true } />
            ))}
          </div>
          <div className="contentinfo">
            <Infosection />
          </div>
        </div>
      </>
    );
  }
}

export default Home;
