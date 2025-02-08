import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//utils
import useLoginvia from "../utils/helpers/loginvia";
import { useAuth } from "../utils/hooks/useAuth";

//components
import Patbtn from "./html/Patbtn";
import Patchip from "./html/Patchip";
import Patdrop from "./html/patdrop/Patdrop";

//queries
import { GETUSERPINNEDPOST } from "./queries/sortpannel";

//css & types
import "./css/sortpannel.css";
import { authcontexttype } from "../context/types";
import { droppertype } from "./html/patdrop/types";
import { USER_S_N_TYPE } from "../utils/main/types";
import { sortprofile } from "../constants/patdropconst";
import { savedposttype, sortpanelprops } from "./types/sortpaneltypes";

const Sortpanel = (sortpanelprops: sortpanelprops) => {
  const { sort, setSort } = sortpanelprops;

  const { user }: authcontexttype = useAuth();
  const anonymouslogin = useLoginvia("anonymousLogin");
  const userId: USER_S_N_TYPE = user && user["id"];

  const sortpanelDroppers: droppertype[] = [
    { title: "New", icn: "timeline", event: () => setSort("created_at"), state: "CLICKED" },
    { title: "Hot", icn: "trending_up", event: () => setSort("likes"), state: "CLICKED" }
  ]

  //queries
  const [getAllPinnedPost, { data, loading }] = useLazyQuery(GETUSERPINNEDPOST);

  //handlers
  const handleSort: (sortby: string) => void = (sortby: string) => {
    setSort(sortby);
  }

  useEffect(() => {
    if (user) {
      getAllPinnedPost({
        variables: {
          filter: {
            user_id: userId!,
            pinned: true
          }
        }
      })
    }
  }, [user]);

  return (
    <div className="sortpannel">
      {user ? (
        <>
          <div className="sortpanelicn">
            <i className="material-icons tiny blue-text"> location_on </i>
          </div>
          <div className="sortposts">
            {!loading && (
              data?.listSavedPost.length > 0 ? (
                data?.listSavedPost.map((savedpost: savedposttype, idx: number) => (
                  <Link to={`/post/${savedpost.post_id.id}`} key={idx}>
                    <Patchip
                      title={savedpost.post_id.title.length > 22 ?
                        savedpost.post_id.title.trim().substring(0, 23) + "..." :
                        savedpost.post_id.title.trim()
                      }
                    />
                  </Link>
                ))
              ) : (
                <div className="sortpoststxt"> Your pinned posts shows here </div>
              )
            )}
          </div>
          <div className="sortpaneloptions">
            <Link to={"/create/post"}>
              <Patbtn
                text={"Post"}
                icn={"add"}
              />
            </Link>
            <div className="sortpanelsortoptions">
              <Patdrop profile={sortprofile} droppers={sortpanelDroppers} />
            </div>
          </div>
        </>
      ) : (
        <div className="nologinsort">
          <Patbtn
            icn={"timeline"}
            text={"new"}
            handleClick={() => handleSort("created_at")}
            state={sort === "created_at" ? "active" : "inactive"}
          />
          <Patbtn
            icn={"trending_up"}
            text={"popular"}
            handleClick={() => handleSort("likes")}
            state={sort === "likes" ? "active" : "inactive"}
          />
          <div className="lastbtn">
            <Patbtn
              text={"anonymous"}
              icn={"perm_identity"}
              handleClick={() => anonymouslogin()}
            />
          </div>
          {/* <div className="waves-effect sortpanelbtnlogin  waves-light" onClick={() => anonymouslogin()}>
            <i className="material-icons sortpanelbtnicn">perm_identity</i>
            Anonymous Browsing
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Sortpanel;
