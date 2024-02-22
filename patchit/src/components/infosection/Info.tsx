import React from "react";
import { useQuery } from "@apollo/client";

//components
import Infotab from "./Infotab";
import Infouserscommunity from "./Infouserscommunity";
import Loadingpage from "../Loadingpage";

import { GETCOMMUNITIES } from "../queries/infosection"; //query

//css
import "./css/infocontent.css";
import { infosectionprops } from "./types";

const Infosection = (infosectionprops: infosectionprops) => {   
  const { communitypatcherdata } = infosectionprops;

  const { loading, data: getpopularcommunitiesdata } = useQuery(GETCOMMUNITIES, {
      variables: {
        filter: {
          status: "ACTIVE",
          privacy: "PUBLIC"
        },
        limit: 10,      
      }
  });
 
  return(
    <div className="info">
      { communitypatcherdata ? (
        <Infouserscommunity communitypatcherdata={ communitypatcherdata } />          
      ) : (
        <div className="infosec"> 
          <div className="infotabheading"> Explore Popular </div>
          { loading === false ? (
            getpopularcommunitiesdata?.listCommunities.map((community: any, idx: number) => (
              <Infotab community={ community } key={ idx } />
            ))
          ): (
            <Loadingpage />
          )}
        </div>
      )}
    </div>
  );
}

export default Infosection;
