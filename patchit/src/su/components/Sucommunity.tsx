import React from "react";

import { sucommunityprops } from "../types";

const Sucommunity = (sucommunityprops: sucommunityprops) => {
  const { community } = sucommunityprops;

  return (
    <div className="suprofiles">
      <div className="actions waves-effect waves-light">
        <i className="material-icons tiny red-text"> delete </i>
      </div>
      <div className="suprofilecontent">
        <div className="suprofilespicwrapper">
          <img className="suprofilepic" alt={"user_profile"}/>
        </div>
        <div className="suprofileabout">
          <div className="suprofileusername"> c/{ community.communityname } </div>
          <div className="suprofileemail"> { community.privacy } </div>
        </div>
      </div>
    </div>
  );
}

export default Sucommunity;