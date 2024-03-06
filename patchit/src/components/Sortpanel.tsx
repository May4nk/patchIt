import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useAuth } from "../common/hooks/useAuth";

//components
import Patdrop from "./html/patdrop/Patdrop";
import useLoginvia from "../common/loginvia";

//queries
import { GETUSERPINNEDPOST } from "./queries/sortpannel";

//css
import "./css/sortpannel.css";
import { authcontexttype } from "../context/types";
import { sortprofile } from "../constants/patdropconst";

interface sortpanelprops {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}

const Sortpanel = (sortpanelprops: sortpanelprops) => {
  const { sort, setSort } = sortpanelprops;

  const { user }: authcontexttype = useAuth();
  const userId: number|null = user && Number(user["id"] || user["user_id"]);

  const anonymouslogin = useLoginvia("anonymousLogin");

  const sortpanelDroppers = [
    { value: "New", icn: "timeline", event: () => setSort("created_at"), state: "clicked" },
    { value: "Hot", icn: "trending_up", event: () => setSort("likes"), state: "clicked" }
  ]
  
  const [getAllPinnedPost, { data, loading }] = useLazyQuery(GETUSERPINNEDPOST);

  //handlers
  const handleSort: (sortby: string) => void = (sortby) => {
    setSort(sortby);
  }
   
  useEffect(() => {   
    if(user) {
      getAllPinnedPost({
        variables: {
          filter: {
            user_id: userId!,
            pinned: true
          }
        }
      })
    }         
  },[user]);

  return (
    <div className="sortpannel">       
        { user ? ( 
          <>
            <div className="sortpanelicn">
              <i className="material-icons tiny blue-text"> location_on </i>
            </div>
            <div className="sortposts">
              { !loading && (
                data?.listSavedPost.length > 0 ? (
                  data?.listSavedPost.map((post: any, idx: number) => (
                    <Link to={`/post/${post.post_id.id}`} className="sortposttabs" key={ idx }> 
                      { post.post_id.title.length > 22 ? post.post_id.title.trim().substr(0,23)+"..." : post.post_id.title.trim() }
                    </Link>
                  ))
                ) : (
                <div className="sortpoststxt"> Your pinned posts shows here </div>
                )
              )}
            </div>
            <div className="sortpaneloptions">
              <Link to={"/post/new"} className="waves-effect sortpanelbtn waves-light">
                <i className="material-icons sortpanelbtnicn">add</i>
                Post
              </Link>
              <div className="sortpanelsortoptions">
                <Patdrop profile={ sortprofile } droppers={ sortpanelDroppers } />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={`waves-effect sortpanelbtn waves-light ${sort === "created_at" && "blue black-text"}`} onClick={() => handleSort("created_at")}>
              <i className="material-icons sortpanelbtnicn">timeline</i>
              New
            </div>
            <div className={`waves-effect sortpanelbtn waves-light ${sort === "likes" && "blue black-text"}`} onClick={() => handleSort("likes")}>
              <i className="material-icons sortpanelbtnicn">trending_up</i>
              Popular
            </div>
            <div className="waves-effect sortpanelbtnlogin  waves-light" onClick={ () => anonymouslogin() }>
              <i className="material-icons sortpanelbtnicn">perm_identity</i>
              Anonymous Browsing
            </div>
          </>
        )}       
    </div>
  );
};

export default Sortpanel;
