import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useAuth } from "../utils/hooks/useAuth";

//components
import Post from "../components/post/Post";
import Sortpanel from "../components/Sortpanel";
import Loadingpage from "../components/Loadingpage";
import Infosection from "../components/infosection/Info";

//queries
import { GETALLPOSTS } from "./queries/common";
import { GETALLPOSTFORHOME } from "./queries/home";

//css & types
import "./css/main.css";
import { authcontexttype } from "../context/types";
import { homeposttype, posttype, USER_S_N_TYPE } from "../utils/main/types";

const Home = () => {
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

  //states
  const [sortby, setSortby] = useState<string>("created_at");

  //queries
  const [getPosts, { data: postData, loading: postLoading }] = useLazyQuery(GETALLPOSTS);
  const [getPostsForHome, { data: homePostData, loading: homePostLoading }] = useLazyQuery(GETALLPOSTFORHOME);

  //handlers
  const pdata = userId !== null
    ? !homePostLoading && homePostData?.listUsersCommunity.map(
      (posts: homeposttype) => posts.community_id?.posts
    ).flat(1)
    : !postLoading && postData?.listPosts;

  useEffect(() => {
    if (userId !== null) {
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
          }
        }
      })
    }
  }, [userId, sortby])

  if (postLoading || homePostLoading) {
    return <Loadingpage />
  } else {
    return (
      <>
        <div className="flexy">
          <div className="patchcontent">
            <div className="postsort">
              <Sortpanel sort={sortby} setSort={setSortby} />
            </div>
            {pdata?.map((post: posttype, idx: number) => (
              <Post
                key={idx}
                postData={post}
                showcommunity={post.community_id === null ? false : true}
              />
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
