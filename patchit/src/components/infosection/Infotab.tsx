import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//utils
import { getSignedUrls } from "../../utils/services/s3";

//css & types
import "./css/infotab.css";
import { infotabprops } from "./types";
import { signedurltype } from "../../utils/types";
import { USER_S_N_TYPE } from "../../utils/main/types";
import { defaultCommunityPic } from "../../constants/const";

const Infotab = (infotabprops: infotabprops) => {
  const { community } = infotabprops;

  const [profile, setProfile] = useState<USER_S_N_TYPE>(null);

  useEffect(() => {
    if (community) {
      const profile_pic: USER_S_N_TYPE = community.profile_pic;
      if (profile_pic !== null && profile_pic.length > 0) {
        (async function () {
          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: community.owner.id,
            postId: "0",
            req: "GET",
            files: [{ name: profile_pic }]
          });

          setProfile(signedUrls[0].signedUrl);
        }());
      }
    }

  }, [community]);

  return (
    <div className="infotab">
      <div className="infosecabout">
        <Link to={`/c/${community.name}`} className="popularcommunity">
          <div className="popularcommunityheader">
            <div className="popularcommunitypicwrapper">
              <img
                alt="community profile pic"
                className="popularcommunitypic"
                src={profile || defaultCommunityPic}
              />
            </div>
            <div className="popularcommunitybody">
              <div className="popularcommunitytitle">
                {community.name}
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
