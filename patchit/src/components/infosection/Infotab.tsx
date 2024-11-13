import React from "react";
import { Link } from "react-router-dom";

//css & types
import "./css/infotab.css";
import { infotabprops } from "./types";
import { defaultCommunityPic } from "../../constants/const";

const Infotab = (infotabprops: infotabprops) => {
  const { community } = infotabprops;

  return (
    <div className="infotab">
      <div className="infosecabout">
        <Link to={`/c/${community.communityname}`} className="popularcommunity">
          <div className="popularcommunityheader">
            <div className="popularcommunitypicwrapper">
              <img
                alt="community profile pic"
                className="popularcommunitypic"
                src={community?.profile_pic || defaultCommunityPic}
              />
            </div>
            <div className="popularcommunitybody">
              <div className="popularcommunitytitle">
                {community.communityname}
              </div>
              <div className="popularcommunityfooter">
                <div className="popularcommunityfooterprops">
                  <i className="material-icons red-text tiny popularcommunityfootericn"> perm_identity </i>
                  {community?.users.length || 0}
                </div>
                <div className="popularcommunityfooterprops">
                  <i className="material-icons blue-text tiny popularcommunityfootericn"> center_focus_weak </i>
                  {community?.posts.length || 0}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Infotab;
