import React from "react";
import { Link } from "react-router-dom";

import "./searchbox.css"; //css
import { searchdropprops } from "./types";

const Searchdrop = (searchdropprops: searchdropprops) => {
  const { community, search } = searchdropprops;

  return (    
    <Link to={`c/${community?.communityname}`} className="communitysearchresult waves-effect waves-light">              
      <i className="material-icons grey-text text-darken-3"> { search ? "search" : "trending_up" } </i>  
      <div className="searchedcommunityabout"> 
        <div className="searchedcomunityname">
          { community?.communityname }
        </div>
        { community.description && (
          <div className="searchedcommunitymembers">
            { community?.description}
          </div>
        )}
      </div>            
    </Link>             
  )
}

export default Searchdrop;
