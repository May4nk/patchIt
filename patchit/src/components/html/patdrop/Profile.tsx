import React from "react";

import { defaultUPic } from "../../../utils/helpers/helpers";

//components
import Askinput from "../Askinput";

//css & types
import "./patdrop.css";
import { patprofileprops } from "./types";

const Profile = (patprofileprops: patprofileprops) => {
  const { profile, dropped, setDropped, setActiveState, activeState, setPatInput, patInput } = patprofileprops;

  return (
    <div className="patdropdownprofile" onClick={() => setActiveState(profile?.state || activeState)}>
      {activeState === "INPUT" ? (
        <div className="patprofileinput">
          <Askinput
            prefixes={["ICsearch"]}
            name={profile?.name}
            value={patInput}
            placeholder={profile?.placeholder}
            onChange={(e) => setPatInput(e.target.value)}
          />
        </div>
      ) : (
        <div className="patprofile" onClick={() => setDropped(!dropped)}>
          {profile?.icn && (
            <i className="material-icons patprofileicn">
              {profile?.icn}
            </i>
          )}
          {profile?.img && (
            <div className="patprofileimgwrapper">
              <img
                alt={"pic"}
                src={profile?.img}
                className="patprofileimg"
                onError={defaultUPic}
              />
            </div>
          )}
          <div className="patprofiletitle">
            <div className="patprofiletitletxt">
              {profile?.title}
            </div>
            {profile?.meta && (
              <div className="patmetaprofile">
                {profile?.meta?.icn && (
                  <i className="material-icons patprofilemetaicn blue-text">
                    {profile?.meta?.icn}
                  </i>
                )}
                {profile?.meta?.img && (
                  <div className="patprofilemetaimgwrapper">
                    <img
                      alt={"pic"}
                      src={profile?.meta?.img}
                      className="patprofilemetaimg"
                    />
                  </div>
                )}
                {profile?.meta.title}
              </div>
            )}
          </div>
        </div>
      )}
      <i className="material-icons" onClick={() => setDropped(!dropped)}>
        {dropped ? "arrow_drop_up" : "arrow_drop_down"}
      </i>
    </div>
  )
}

export default Profile;
