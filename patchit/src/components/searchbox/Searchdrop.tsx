import React from "react";
import { Link } from "react-router-dom";

//css & types
import "./searchbox.css";
import { searchdropprops } from "./types";

const Searchdrop = (searchdropprops: searchdropprops) => {
  const { community, search } = searchdropprops;

  return (
    <Link
      to={`c/${community?.name}`}
      className="communitysearchresult waves-effect waves-light"
    >
      <i className="material-icons grey-text text-darken-3 communitysearchicn">
        {search ? "search" : "trending_up"}
      </i>
      <div className="searchedcommunityabout">
        <div className="searchedcomunityname">
          {community?.name}
        </div>
        {community.about && (
          <div className="searchedcommunitymembers">
            {community?.about}
          </div>
        )}
      </div>
    </Link>
  )
}

export default Searchdrop;
