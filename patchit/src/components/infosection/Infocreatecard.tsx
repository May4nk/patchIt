import React from "react";

import "./css/infocreatecard.css";
import { infocreatecardprops } from "./types";

const Infocreatecard = ( infocreatecardprops: infocreatecardprops  ) => {   
  const { data } = infocreatecardprops;
    
  const communitybgpic = (data?.background_pic !== null && data?.background_pic.length > 0) 
    ? data?.background_pic.substr(12, ) 
    : "defaultbgpic.png";
  
  const communitydp = (data?.profile_pic?.length > 0 && data?.profile_pic !== null)
    ? data?.profile_pic?.substr(12, ) 
    : "a.jpg";
  
  return(
    <div className="info">
      <div className="infocreatecardoverview">
        <div className="infocreatecardbackgroundpicwrapper"> 
          <img src={ require(`../../img/${communitybgpic}`) } alt="profile pic" className="infocreatecardbackgroundpic" />
        </div>
        <div className="infocreatecardoverviewcontent">
          <div className="overviewcreatecardpicwrapper"> 
            <img src={ require(`../../img/${communitydp}`) } alt="profile pic" className="overviewpic" />
          </div>
          <div className="infocreatecardcommunityname"> { data?.communityname }</div>
        </div>
      </div>
      <div className="infocreatecardabout">       
        <div className="infocreatecardaboutcontent">
          { data?.description }
        </div>
        <div className="infocreatecardaboutcommunity"> 
          <div className="infocreatecardaboutcommunitymembers"> 
            { data?.users?.length || 0 }
            <i className="material-icons tiny">perm_identity</i>
          </div>
          <div className="infocreatecardaboutcommunitymembers"> 
            { data?.posts?.length || 0 }
            <i className="material-icons tiny">center_focus_weak</i>
          </div>
          <div className="infocreatecardaboutcommunitymembers"> 
            24 
            <i className="material-icons tiny">blur_on</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Infocreatecard;
