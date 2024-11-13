import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

//components
import Post from "../components/post/Post";
import Sortpanel from "../components/Sortpanel";
import Loadingpage from "../components/Loadingpage";
import Infosection from "../components/infosection/Info";
import Popularpagecard from "../components/cards/Popularpagecard";

//queries
import { GETALLPOSTS, GETPOPULARCARDPOSTS } from "./queries/common";

//css
import "./css/main.css";
import "./css/popular.css";
import { posttype, popularcardtype } from "../utils/main/types";

const Popular = () => {
  //states
  const [sortby, setSortby] = useState<string>("likes");

  //queries
  const [getPopularCards, { data, loading, error }] = useLazyQuery(GETPOPULARCARDPOSTS);
  const [getPosts, { data: postsData, loading: postsLoading, error: postsError }] = useLazyQuery(GETALLPOSTS);

  //handlers
  useEffect(() => {
    getPosts({
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

  useEffect(() => {
    getPopularCards({
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
  }, []);

  if (loading) {
    return (
      <Loadingpage />
    )
  } else if (error) {
    return (
      <Loadingpage err={error.message} />
    )
  } else {
    return (
      <>
        {data?.listPosts?.length > 0 && (
          <>
            <div className="popularpagetitle"> Trending </div>
            <div className="popularpagecards">
              {data?.listPosts?.map((post: popularcardtype, idx: number) => (
                <Popularpagecard
                  key={idx}
                  data={post}
                />
              ))}
            </div>
          </>
        )}
        {(postsLoading) ? (
          <Loadingpage />
        ) : (postsError) ? (
          <Loadingpage err={postsError.message} />
        ) : (
          postsData?.listPosts.length > 0 && (
            <div className="flexy">
              <div className="patchcontent">
                <div className="postsort">
                  <Sortpanel sort={sortby} setSort={setSortby} />
                </div>
                {postsData?.listPosts?.map((post: posttype, idx: number) => (
                  <Post
                    key={idx}
                    postData={post}
                    showcommunity={post.community_id !== null}
                  />
                ))}
              </div>
              <div className="contentinfo">
                <Infosection />
              </div>
            </div>
          ))
        }
      </>
    );
  }
}

export default Popular;
