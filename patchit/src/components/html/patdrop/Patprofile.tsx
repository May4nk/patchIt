import React from "react";

import Askinput from "../Askinput";

//css & types
import "./patdrop.css";
import { patprofileprops } from "./types";

const Patprofile = (patprofileprops: patprofileprops) => {
  const { profile, dropped, setDropped, setActiveState, activeState, profileDispatch } = patprofileprops;

  return (  
    <div className="patdropdownprofile" onClick={() => setActiveState(profile?.state || "default")}>
      { activeState === "input" ? (
        <div className="patprofileinput">
          <Askinput 
            value={ profile?.search } 
            onChange={(e) => profileDispatch({ type: "input", payload: e.target })} 
            name={ profile?.name } 
            placeholder={ profile?.placeholder } 
            prefix={"ICsearch"} 
          />
        </div>      
      ) : (
        <div className="patprofile" onClick={() => setDropped(!dropped)}>          
            { profile?.icn && (
              <i className="material-icons patprofileicn">
                { profile?.icn }
              </i>
            )}
            { profile?.img && (
              <div className="patprofileimgwrapper">
                <img src={ profile?.img } className="patprofileimg" alt={ "pic" } />
              </div>
            )}
            <div className="patprofiletitle">
              { profile?.title }
              { profile?.meta && (
                <div className="patmetaprofile">
                  { profile?.meta?.icn && (
                    <i className="material-icons patprofilemetaicn blue-text">
                      { profile?.meta?.icn }
                    </i>
                  )}
                  { profile?.meta?.img && (
                    <div className="patprofilemetaimgwrapper">
                      <img src={ profile?.meta?.img } className="patprofilemetaimg" alt={ "pic" } />
                    </div>
                  )}  
                  { profile?.meta.title }                
                </div>
              )}
            </div>
        </div>
      )}
      <i className="material-icons" onClick={() => setDropped(!dropped)}>
        { dropped ? "arrow_drop_up" : "arrow_drop_down" }
      </i>
    </div>   
  )  
}

export default Patprofile;
