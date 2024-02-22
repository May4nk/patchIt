import React, { useState, useRef, useReducer, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

//components
import Patprofile from "./Patprofile";
import Patdropper from "./Patdroppers";
import Conditionallink from "../../Conditionallink";

//css & types
import "./patdrop.css";
import { droppertype, patdropprops, profiletype, statetype,currentstatetype } from "./types";

const Patdrop = (patdropprops: patdropprops) => {
  const { profile, droppers, searchinto } = patdropprops;
  const thisRef = useRef<HTMLDivElement>(null);  
  const location = useLocation();
  const param = useParams();

  const initialState: statetype = { 
    img: profile?.img,
    title: profile?.title,
    icn: profile?.icn,    
    meta: profile?.meta,
    search: "",
  }

  const current: Record<string, currentstatetype> = {
    "/home" : { icn: "home", title: "Home" },
    "/c/popular": { icn: "whatshot", title: "Popular" },
    "/u/": { icn: "perm_identity", title: param.uname! },
    "/c/": { icn: "people_outline", title: param.cname! },
    "/post/new": { icn: "add_to_photos", title: "Create post"},
    "/post/": { icn: "panorama", title: "Post" },
    "/search/": { icn: "search", title: "Search" },
    "/c/settings": { icn: "settings", title: param.cname! },
    "/u/settings": { icn: "settings", title: param.uname! }
  }

  const [dropped, setDropped] = useState<boolean>(false);
  const [activeState, setActiveState] = useState<string>("default");
  const [currentstate, setCurrentState] = useState<currentstatetype>({ icn: "", title: "" });

  const [profileState, profileDispatch] = useReducer(dropperProfileReducer, initialState);

  //handlers
  const closeDropper: (e: any) => void = (e: any) => {
    if (thisRef.current && dropped && !thisRef.current.contains(e.target)) {
      setActiveState("default");
      setDropped(false);
    }
  }
  document.addEventListener('mousedown', closeDropper);

  function dropperProfileReducer(state: statetype, action: { type: string, payload: any }): statetype { 
    switch(action.type) {
      case "clicked":  
        const src: string|undefined = action.payload?.firstChild?.outerText || action.payload?.firstChild?.childNodes[0]?.currentSrc;
        const clickedState: profiletype = {
          title: action?.payload?.lastChild?.wholeText,
          [src?.substr(0,3) === "htt"? "img" : "icn"]: src,
        }

        setDropped(false);

        return clickedState;

      case "input":
        const inputState: profiletype = {
          ...state, 
          search: action.payload?.value, 
          title: action.payload?.value?.length === 0 ? profile?.title : action.payload?.value, 
          icn: profile?.icn,
          img: profile?.img,         
        }

        return inputState;
      
      case "linked":         
        return state;
            
      default:
        return state;    
    }
  }

  const handleActiveState: (e: any, dropper: droppertype) => void = (e: any, dropper: droppertype) => {    
    if(dropper?.event) {
      dropper?.event();
    }
    if(dropper?.state) {
      setActiveState(dropper?.state);
      profileDispatch({ type: dropper?.state, payload: e.currentTarget })
    }
  }  
  
  let checksearchdropper: droppertype[]|[] = (activeState === "input" && searchinto && profileState?.search && profileState?.search.length > 1) ? ( 
    searchinto?.filter((item: droppertype ) => (
      item.value.includes(profileState?.search!)
    ))
  ) : [];

  useEffect(() => {
    if(profile?.state === "current") {
      if (location.pathname.includes("/c/popular")) {
        setCurrentState(current["/c/popular"]);
      } else if (location.pathname === "/") {
        setCurrentState(current["/c/popular"]);
      } else if (location.pathname.includes("/post/new")) {
        setCurrentState(current["/post/new"]);
      } else if (location.pathname.includes("/search/")) {
        setCurrentState(current["/search/"]);
      } else if (location.pathname.includes("/u/") && location.pathname.includes("settings")){
        setCurrentState(current["/u/settings"]);
      } else if (location.pathname.includes("/u/")) {
        setCurrentState(current["/u/"]);
      } else if (location.pathname.includes("/c/") && location.pathname.includes("settings")){
        setCurrentState(current["/c/settings"]);
      } else if (location.pathname.includes("/c/")) {
        setCurrentState(current["/c/"]);
      } else if (location.pathname.includes("/post/")) {
        setCurrentState(current["/post/"]);
      } else {
        setCurrentState(current[location.pathname]);
      }
    }  
  },[location.pathname, profile?.state]);
 
  return (
    <div className="patdropdown" ref={ thisRef }>
      { profile.state === "current" ? (
        <Patprofile 
          profile={ currentstate } 
          dropped={ dropped } 
          setDropped={ setDropped } 
          activeState={ activeState }
          setActiveState={ setActiveState }
          profileDispatch={ profileDispatch }
        />
      ) : (
        <Patprofile 
          profile={ { ...profileState, state: profile.state } } 
          dropped={ dropped } 
          setDropped={ setDropped } 
          activeState={ activeState }
          setActiveState={ setActiveState }
          profileDispatch={ profileDispatch }        
        />
      )}    
      { dropped && (
        <div className="patdrophiddenitems">
          { activeState === "input" && (
            checksearchdropper.map((searched: droppertype, idx: number) => (
              <Patdropper 
                key={ idx }
                dropped={ searched }
                handleClick={(e: any) => handleActiveState(e, searched)}
              />
            ))
          )}
          { droppers.map((dropper: droppertype, idx: number) => (
            dropper?.state  === "linked" ? (
              <Conditionallink ifthis={ dropper?.state === "linked" } link={ dropper?.link } key={ idx }>
                <Patdropper               
                  dropped={ dropper } 
                  handleClick={(e: any) => handleActiveState(e, dropper)} 
                />
              </Conditionallink>           
            ) : (
              <Patdropper 
                key={ idx }  
                dropped={ dropper } 
                handleClick={(e: any) => handleActiveState(e, dropper)} 
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default Patdrop;
