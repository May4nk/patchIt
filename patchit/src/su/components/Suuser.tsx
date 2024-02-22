import React from "react";

import { suuserprops } from "../types";

const Suuser = (suuserprops: suuserprops) => {
  const { user } = suuserprops;

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
          <div className="suprofileusername"> u/{user.username} </div>
          <div className="suprofileemail"> {user.email} </div>
        </div>
      </div>
    </div>
  );
}

export default Suuser;