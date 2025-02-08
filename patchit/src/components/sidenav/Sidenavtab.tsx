import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//utils
import { getSignedUrls } from "../../utils/services/s3";

//component
import Loadingpage from "../Loadingpage";

//query

import { GETCOMMUNITIES } from "./queries";

//css & types
import "./css/sidenavtab.css";
import { signedurltype } from "../../utils/types";
import { USER_S_N_TYPE } from "../../utils/main/types";
import { communitytype, sidenavtabprops } from "./types";
import { defaultCommunityPic } from "../../constants/const";

const Sidenavtab = (sidenavtabprops: sidenavtabprops) => {
  const { icon, colname, category } = sidenavtabprops;

  //states
  const [open, setOpen] = useState<boolean>(false);
  const [communities, setCommunities] = useState<{ [key: string]: string | null }>({});

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
        },
        onCompleted: (({ listCommunities }: { listCommunities: communitytype[] }) => {
          if (listCommunities) {
            listCommunities.forEach((community: communitytype) => {
              const profile_pic: USER_S_N_TYPE = community.profile_pic;
              if (profile_pic !== null && profile_pic.length > 0) {
                (async function () {
                  const signedUrls: signedurltype[] = await getSignedUrls({
                    userId: community.owner.id,
                    postId: "0",
                    req: "GET",
                    files: [{ name: profile_pic }]
                  });

                  setCommunities(prevCommunities => ({
                    ...prevCommunities,
                    [community.name]: signedUrls[0].signedUrl
                  }));
                }());
              } else {
                setCommunities(prevCommunities => ({
                  ...prevCommunities,
                  [community.name]: null
                }));
              }
            })
          }
        })
      })
    } else {
      setCommunities({});
    }

  }, [open, category]);

  return (
    <div className="sidenavcomponents" onClick={handleOpen}>
      <div className="sidenavcomponentheader waves-effect waves-light">
        <i className="material-icons sidenavcomponenticon">{icon}</i>
        <span className="componentname">{colname}</span>
      </div>
      {(open && data?.listCommunities.length > 0) && (
        <div className="sidenavcomponentcontent">
          {!loading ? (
            data?.listCommunities?.map((community: communitytype, idx: number) => (
              <Link to={`c/${community.name}`} key={idx} className="sidenavcomponentcontenttab">
                <div className="sidenavtabimgwrapper">
                  <img
                    alt={"community_pp"}
                    className="sidenavtabimg"
                    src={communities[community.name] || defaultCommunityPic}
                  />
                </div>
                {community.name}
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
