import React from "react";
import { useNavigate } from "react-router-dom";

//css, constants & types
import "./css/infocreatecard.css";
import { infocreatecardprops } from "./types";
import { defaultCommunityPic } from "../../constants/const";
let bgpic: string = require("../../img/defaultbgpic.png");

const Infocreatecard = (infocreatecardprops: infocreatecardprops) => {
  const { data } = infocreatecardprops;
  const navigate = useNavigate();

  return (
    <div className="info">
      <div className="infocreatecardoverview">
        <div className="infocreatecardbackgroundpicwrapper">
          <img
            src={data?.background_pic || bgpic}
            alt="background_pic"
            className="infocreatecardbackgroundpic"
          />
        </div>
        <div className="infocreatecardoverviewcontent">
          <div className="overviewcreatecardpicwrapper">
            <img
              src={data?.profile_pic || defaultCommunityPic}
              alt="community pic"
              className="overviewpic"
            />
          </div>
          <div className="infocreatecardcommunityname">
            {data?.communityname}
          </div>
        </div>
      </div>
      <div className="infocreatecardabout">
        <div className="infocreatecardaboutcontent">
          {data?.about}
        </div>
        <div className="infocreatecardjoin">
          <div
            className="infocreatecardjoinbtn"
            onClick={() => navigate(`/c/${data?.communityname}`)}
          >
            <i className="material-icons infocreatecardicn blue-text text-lighten-3">
              {data?.inCommunity ? "perm_identity" : "explore"}
            </i>
            explore
          </div>
        </div>
        <div className="infocreatecardaboutcommunity">
          <div className="infocreatecardaboutcommunitymembers">
            {data?.users?.length || 0}
            <i className="material-icons tiny">perm_identity</i>
          </div>
          <div className="infocreatecardaboutcommunitymembers">
            {data?.posts?.length || 0}
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
