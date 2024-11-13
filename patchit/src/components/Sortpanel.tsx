import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import useLoginvia from "../utils/loginvia";
import { useAuth } from "../utils/hooks/useAuth";

//components
import Patdrop from "./html/patdrop/Patdrop";

//queries
import { GETUSERPINNEDPOST } from "./queries/sortpannel";

//css & types
import "./css/sortpannel.css";
import { authcontexttype } from "../context/types";
import { sortprofile } from "../constants/patdropconst";
import { droppertype } from "./html/patdrop/types";
import { savedposttype, sortpanelprops } from "./types/sortpaneltypes";

const Sortpanel = (sortpanelprops: sortpanelprops) => {
  const { sort, setSort } = sortpanelprops;
  const anonymouslogin = useLoginvia("anonymousLogin");

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

  const sortpanelDroppers: droppertype[] = [
    { title: "New", icn: "timeline", event: () => setSort("created_at"), state: "CLICKED" },
    { title: "Hot", icn: "trending_up", event: () => setSort("likes"), state: "CLICKED" }
  ]

  //queries
  const [getAllPinnedPost, { data, loading }] = useLazyQuery(GETUSERPINNEDPOST);

  //handlers
  const handleSort: (sortby: string) => void = (sortby: string) => {
    setSort(sortby);
  }

  useEffect(() => {
    if (user) {
      getAllPinnedPost({
        variables: {
          filter: {
            user_id: userId!,
            pinned: true
          }
        }
      })
    }
  }, [user]);

  return (
    <div className="sortpannel">
      {user ? (
        <>
          <div className="sortpanelicn">
            <i className="material-icons tiny blue-text"> location_on </i>
          </div>
          <div className="sortposts">
            {!loading && (
              data?.listSavedPost.length > 0 ? (
                data?.listSavedPost.map((savedpost: savedposttype, idx: number) => (
                  <Link to={`/post/${savedpost.post_id.id}`} className="sortposttabs" key={idx}>
                    {savedpost.post_id.title.length > 22 ?
                      savedpost.post_id.title.trim().substring(0, 23) + "..." :
                      savedpost.post_id.title.trim()
                    }
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
              <Patdrop profile={sortprofile} droppers={sortpanelDroppers} />
            </div>
          </div>
        </>
      ) : (
        <div className="nologinsort">
          <div
            className={`waves-effect sortpanelbtn waves-light ${sort === "created_at" && "blue black-text"}`}
            onClick={() => handleSort("created_at")}
          >
            <i className="material-icons sortpanelbtnicn">timeline</i>
            New
          </div>
          <div
            className={`waves-effect sortpanelbtn waves-light ${sort === "likes" && "blue black-text"}`}
            onClick={() => handleSort("likes")}
          >
            <i className="material-icons sortpanelbtnicn">trending_up</i>
            Popular
          </div>
          <div className="waves-effect sortpanelbtnlogin  waves-light" onClick={() => anonymouslogin()}>
            <i className="material-icons sortpanelbtnicn">perm_identity</i>
            Anonymous Browsing
          </div>
        </div>
      )}
    </div>
  );
};

export default Sortpanel;
