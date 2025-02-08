import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";

//components
import Infotab from "./Infotab";
import Loadingpage from "../Loadingpage";
import Infouserscommunity from "./Infouserscommunity";

//query
import { GETCOMMUNITIES } from "../queries/infosection";

//css
import "./css/infocontent.css";
import { communitytype, infosectionprops } from "./types";

const Infosection = (infosectionprops: infosectionprops) => {
  const { communitypatcherdata } = infosectionprops;
  const location = useLocation();

  //query
  const [getCommunities, { loading, data: getpopularcommunitiesdata }] = useLazyQuery(GETCOMMUNITIES);

  useEffect(() => {
    if (location.pathname.includes("/home") || location.pathname.includes("/popular") || location.pathname === "/") {
      getCommunities({
        variables: {
          filter: {
            status: "ACTIVE",
            privacy: "PUBLIC"
          },
          limit: 10,
        }
      });
    }
  }, [location.pathname])

  return (
    <div className="info">
      {communitypatcherdata ? (
        <Infouserscommunity communitypatcherdata={communitypatcherdata} />
      ) : (
        <div className="infosec">
          <div className="infotabheading"> Explore Popular </div>
          {loading === false ? (
            getpopularcommunitiesdata?.listCommunities.map((community: communitytype, idx: number) => (
              <Infotab
                key={idx}
                community={community}
              />
            ))
          ) : (
            <Loadingpage />
          )}
        </div>
      )}
    </div>
  );
}

export default Infosection;
