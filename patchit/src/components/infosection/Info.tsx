import React from "react";
import { useQuery } from "@apollo/client";

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

  //query
  const { loading, data: getpopularcommunitiesdata } = useQuery(GETCOMMUNITIES, {
    variables: {
      filter: {
        status: "ACTIVE",
        privacy: "PUBLIC"
      },
      limit: 10,
    }
  });

  return (
    <div className="info">
      {communitypatcherdata ? (
        <Infouserscommunity communitypatcherdata={communitypatcherdata} />
      ) : (
        <div className="infosec">
          <div className="infotabheading"> Explore Popular </div>
          {loading === false ? (
            getpopularcommunitiesdata?.listCommunities.map((community: communitytype, idx: number) => (
              <Infotab community={community} key={idx} />
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
