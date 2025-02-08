import React, { useState, useRef, useReducer, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

//components
import Profile from "./Profile";
import Dropper from "./Dropper";
import Conditionallink from "../../Conditionallink";

//constants, css & types
import "./patdrop.css";
import { droppertype, patdropprops, currentstatetype, actiontype, profiletype } from "./types";

const Patdrop = (patdropprops: patdropprops) => {
  const { profile, droppers, searchinto, name } = patdropprops;

  const param = useParams();
  const location = useLocation();
  const thisRef = useRef<HTMLDivElement>(null);

  const initialState: profiletype = {
    img: profile?.img,
    title: profile?.title,
    icn: profile?.icn,
  }

  const current: Record<string, currentstatetype> = {
    "/home": { icn: "home", title: "Home" },
    "/c/popular": { icn: "whatshot", title: "Popular" },
    "/u/": { icn: "perm_identity", title: param.uname || "" },
    "/c/": { icn: "people_outline", title: param.cname || "" },
    "/create/post": { icn: "add_to_photos", title: "New post" },
    "/post/": { icn: "panorama", title: "Post" },
    "/search/": { icn: "search", title: "Search" },
    "/c/settings": { icn: "settings", title: param.cname || "" },
    "/c/search": { icn: "search", title: param.cname || "" },
    "/u/settings": { icn: "settings", title: param.uname || "" },
    "/patcoin/dashboard": { icn: "blur_on", title: "patcoins" },
  }

  //states  
  const [patInput, setPatInput] = useState<string>("");
  const [dropped, setDropped] = useState<boolean>(false);
  const [activeState, setActiveState] = useState<actiontype>("DEFAULT");
  const [currentstate, setCurrentState] = useState<currentstatetype>({ icn: "", title: "" });

  function dropperProfileReducer(
    state: profiletype,
    action: { type: actiontype; payload: profiletype }
  ): profiletype {
    if (action.payload.set) {
      const foundDropper: droppertype = droppers.find(
        (dropper: droppertype) => dropper.title === action.payload.set
      )!;

      action.payload = {
        img: foundDropper?.img || "",
        title: foundDropper?.title || "",
        icn: foundDropper?.icn || "",
      };
    }

    switch (action.type) {
      case "CLICKED":
        setDropped(false);
        return {
          title: action.payload?.title,
          img: action.payload?.img,
          icn: action.payload?.icn,
          state: "CLICKED",
        };

      case "INPUT":
        return {
          ...state,
          title: state.title ? state.title : action.payload.title,
        };

      case "LINKED":
        setDropped(false);
        return state;

      case "DEFAULT":
        return action.payload;

      default:
        return state;
    }
  }

  //reducer
  const [profileState, profileDispatch] = useReducer(dropperProfileReducer, initialState);

  //handlers
  const closeDropper: (e: MouseEvent) => void = (e: MouseEvent) => {
    if (thisRef.current && dropped && !thisRef.current.contains(e.target as Node)) {
      setDropped(false);
    }
  }

  document.addEventListener('mousedown', closeDropper);

  const handleActiveState: (dropper: droppertype) => void = (dropper: droppertype) => {
    if (dropper?.event) {
      dropper?.event();
    }

    if (dropper?.state) {
      setPatInput(dropper.title);
      setActiveState(dropper?.state);
      profileDispatch({ type: dropper?.state, payload: dropper });
    }
  }

  const filteredDroppers = activeState === "INPUT" && searchinto
    ? searchinto.filter((item: droppertype) => item.title?.includes(patInput))
    : [];

  const droppered = name ? droppers.map((drop: droppertype) => ({ ...drop, name: name })) : droppers;

  useEffect(() => {
    if ((profile && activeState === "DEFAULT") || (profile && activeState === "INPUT" && !patInput.length)) {
      profileDispatch({ type: "DEFAULT", payload: profile });
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.state === "CURRENT") {
      if (location.pathname.includes("/c/popular")) {
        setCurrentState(current["/c/popular"]);
      } else if (location.pathname === "/") {
        setCurrentState(current["/c/popular"]);
      } else if (location.pathname.includes("/create/post")) {
        setCurrentState(current["/create/post"]);
      } else if (location.pathname.includes("/c/") && location.pathname.includes("search")) {
        setCurrentState(current["/c/search"]);
      } else if (location.pathname.includes("/u/") && location.pathname.includes("settings")) {
        setCurrentState(current["/u/settings"]);
      } else if (location.pathname.includes("/u/")) {
        setCurrentState(current["/u/"]);
      } else if (location.pathname.includes("/c/") && location.pathname.includes("settings")) {
        setCurrentState(current["/c/settings"]);
      } else if (location.pathname.includes("/c/")) {
        setCurrentState(current["/c/"]);
      } else if (location.pathname.includes("/post/")) {
        setCurrentState(current["/post/"]);
      } else if (location.pathname.includes("/search/")) {
        setCurrentState(current["/search/"]);
      } else {
        setCurrentState(current[location.pathname]);
      }
    }
  }, [location.pathname, profile?.state]);

  return (
    <div className="patdropdown" ref={thisRef}>
      <Profile
        profile={
          profileState.state === "CURRENT"
            ? currentstate
            : { ...profileState, state: profile?.state || activeState }
        }
        dropped={dropped}
        setDropped={setDropped}
        activeState={activeState}
        setActiveState={setActiveState}
        patInput={patInput}
        setPatInput={setPatInput}
      />
      {dropped && (
        <div className="patdrophiddenitems">
          {(activeState === "INPUT") && (
            filteredDroppers.map((dropper: droppertype, idx: number) => (
              <Dropper
                key={idx}
                dropped={dropper}
                handleClick={() => handleActiveState(dropper)}
              />
            ))
          )}
          {droppered.map((dropper: droppertype, idx: number) => (
            dropper?.state === "LINKED" ? (
              <Conditionallink ifthis={dropper?.state === "LINKED"} link={dropper?.link!} key={idx}>
                <Dropper
                  dropped={dropper}
                  handleClick={() => handleActiveState(dropper)}
                />
              </Conditionallink>
            ) : (
              <Dropper
                key={idx}
                dropped={dropper}
                handleClick={() => handleActiveState(dropper)}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default Patdrop;
