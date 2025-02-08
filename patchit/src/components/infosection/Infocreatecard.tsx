import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//components
import Patbtn from "../html/Patbtn";

//utils
import { getSignedUrls } from "../../utils/services/s3";

//css, constants & types
import "./css/infocreatecard.css";
import { infocreatecardprops } from "./types";
import { USER_S_N_TYPE } from "../../utils/main/types";
import { defaultCPic } from "../../utils/helpers/helpers";
import { defaultCommunityPic } from "../../constants/const";
import { signedfiletype, signedurltype } from "../../utils/types";
let bgpic: string = require("../../img/defaultbgpic.png");

const Infocreatecard = (infocreatecardprops: infocreatecardprops) => {
  const { data } = infocreatecardprops;

  //states
  const [pics, setPics] = useState<{ profile: USER_S_N_TYPE, background: USER_S_N_TYPE }>({
    profile: null,
    background: null
  });

  useEffect(() => {
    if (data) {
      const profile_pic: USER_S_N_TYPE = data?.profile_pic;
      const background_pic: USER_S_N_TYPE = data?.background_pic;

      if (profile_pic || background_pic) {
        const images: signedfiletype[] = []
        if (background_pic !== null) {
          images.push({ name: background_pic })
        }

        if (profile_pic !== null) {
          images.push({ name: profile_pic })
        }

        if (images.length > 0) {
          (async function () {
            const signedUrls: signedurltype[] = await getSignedUrls({
              userId: data?.owner.id,
              postId: "0",
              req: "GET",
              files: images
            });

            signedUrls.map((url: signedurltype) => (
              url.fileUrl.includes(`profile_pic`)
                ? setPics(prev => ({ ...prev, profile: url.signedUrl }))
                : setPics(prev => ({ ...prev, background: url.signedUrl }))
            ))
          }())
        }
      }
    }
  }, [data]);

  return (
    <div className="info">
      <div className="infocreatecardoverview">
        <div className="infocreatecardbackgroundpicwrapper">
          <img
            alt="background_pic"
            src={pics.background || bgpic}
            className="infocreatecardbackgroundpic"
            onError={(e: any) => (e.target.src = bgpic)}
          />
        </div>
        <div className="infocreatecardoverviewcontent">
          <div className="overviewcreatecardpicwrapper">
            <img
              alt="community pic"
              onError={defaultCPic}
              className="overviewpic"
              src={pics.profile || defaultCommunityPic}
            />
          </div>
          <div className="infocreatecardcommunityname">
            {data?.name}
          </div>
        </div>
      </div>
      <div className="infocreatecardabout">
        <div className="infocreatecardaboutcontent">
          {data?.about}
        </div>
        <div className="infocreatecardjoin">
          <Link to={`/c/${data?.name}`}>
            <Patbtn
              text={"explore"}
              icn={data?.inCommunity ? "perm_identity" : "explore"}
            />
          </Link>
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
