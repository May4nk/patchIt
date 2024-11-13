import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import Loadingpage from "../Loadingpage"; //component

import { GETCOMMUNITIES } from "./queries"; //query

//css & types
import "./css/sidenavtab.css";
import { communitytype, sidenavtabprops } from "./types";
import { defaultCommunityPic } from "../../constants/const";

const Sidenavtab = (sidenavtabprops: sidenavtabprops) => {
  const { icon, colname, category } = sidenavtabprops;

  //states
  const [open, setOpen] = useState<boolean>(false);

  //queries
  const [getCommunities, { data, loading }] = useLazyQuery(GETCOMMUNITIES);

  //handlers
  const handleOpen = () => {
    setOpen(!open);
  }

  useEffect(() => {
    if (open && category) {
      getCommunities({
        variables: {
          filter: {
            "category": colname,
            "status": "ACTIVE",
            "privacy": "PUBLIC"
          }
        }
      });
    }
  }, [open]);

  return (
    <div className="sidenavcomponents" onClick={handleOpen}>
      <div className="sidenavcomponentheader waves-effect waves-light">
        <i className="material-icons sidenavcomponenticon">{icon}</i>
        <span className="componentname">{colname}</span>
      </div>
      {(open && data?.listCommunities.length > 0) && (
        <div className="sidenavcomponentcontent">
          {!loading ? (
            data?.listCommunities.map((community: communitytype, idx: number) => (
              <Link to={`c/${community.communityname}`} key={idx} className="sidenavcomponentcontenttab">
                <div className="sidenavtabimgwrapper">
                  <img src={defaultCommunityPic} className="sidenavtabimg" alt={"community_pp"} />
                </div>
                {community.communityname}
              </Link>
            ))
          ) : (
            <Loadingpage />
          )}
        </div>
      )}
    </div>
  );
}

export default Sidenavtab;
