import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../common/hooks/useAuth";

//css & types
import "./css/infouserscommunity.css";
import { infouserscommunityprops, communitypatcherdatatype } from "./types";
import { authcontexttype } from "../../context/types";

const Infouserscommunity = (infouserscommunityprops: infouserscommunityprops) => {
  const { communitypatcherdata } = infouserscommunityprops;
  
  const { user }: authcontexttype = useAuth();
  const userId: number|null = user && Number(user["id"] || user["user_id"]);

  return (
    <div className="infousercommunitycontent">
      <div className="userscommunitytitle"> Handler of patch </div>
      <div className="userscommunitycontent">
        { communitypatcherdata.map((patchdata: communitypatcherdatatype, idx: number) => (          
          <Link to={`/c/${ patchdata.communityname }${ userId === patchdata.owner.id ? "/settings" : "/" }`} className="waves-light waves-effect userscommunitycontenttitle" key={idx}>
            { patchdata.communityname }
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Infouserscommunity;
