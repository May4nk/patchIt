import React, { useState, useReducer, useRef, useEffect } from "react";

//components
import TapdropDroppers from "./TapdropDroppers";
import Conditionallink from "../../Conditionallink";
import Askinput from "../Askinput";

//css & types
import "./css/tapdrop.css";
import { statetype, tapdropprops } from "./types";
import { ACTION } from "../../../constants/const";

const Tapdrop = (tapdropprops: tapdropprops) => {
  const { dropperprofile, droppers, dropperssearch, dropperinput } = tapdropprops;
  
  const [dropped, setDropped] = useState<boolean>(false);  //toggle dropdown
  const [activeState, setActiveState] = useState<string>("default");
  const thisRef = useRef<HTMLDivElement>(null);
  
  const initialState = {
    icnsrc : dropperprofile?.icnsrc,
    imgsrc : dropperprofile?.imgsrc,
    titles : dropperprofile?.titles,
    searchname: [""],
  };
 
  //handlers
  function dropperProfileReducer(state: any, action: { type: string, payload: any }) { //: (state: statetype, action: { type: string, payload: any }) => statetype {
    switch(action.type) {
      case ACTION.CLICKED:
        const src: string = action.payload.firstChild.outerText || action.payload.firstChild.childNodes[0].currentSrc;
        const txt: string = action.payload.lastChild.outerText;
        const clickedprofile = {
          [src.substr(0,3) === "htt"? "imgsrc" : "icnsrc"]: src,
          titles: [txt],
          searchname: dropperprofile?.state === "input" ? [txt] : [""]
        }      
        setDropped(false);
        
        return clickedprofile;
      
      case ACTION.INPUT:
      
        return { 
          ...state, 
          searchname: [`${action.payload.value}`], 
          titles: [`${action.payload.value.length === 0 ? dropperprofile?.titles : action.payload.value }`], 
          icnsrc: dropperprofile?.icnsrc, 
          imgsrc: dropperprofile?.imgsrc 
        };
      
      default:
        return state
    }
  }

  const handleActiveState: () => void = () => {
    if(dropperprofile?.state) {
      setActiveState(dropperprofile.state);
    } else {
      setActiveState("default");
    }
  }
  
  const closeDropper: (e: any) => void = (e: any) => {   
    if(thisRef.current && dropped && !thisRef.current.contains(e.target)){
      setActiveState("");
      setDropped(false)
    }
  }

  const handleClicked: (e: any, clicker: any) => void = (e: any, clicker: any) => {
    profileDispatch({ type: ACTION.CLICKED, payload: e.currentTarget })
    if(clicker.clickEvent === "event"){
      clicker.event() 
    }
  }   
     
  document.addEventListener('mousedown',closeDropper);

  const [profileState, profileDispatch] = useReducer(dropperProfileReducer, initialState);
  
  let checksearchdropper = (activeState === "input" && profileState?.searchname[0].length > 1) ? ( 
    dropperssearch?.filter((item: any ) => (
      item.value.includes(profileState.searchname)
    ))
  ): [];

  useEffect(() => {
    if(dropperinput) {
      dropperinput(profileState?.titles[0]);    
    }
  }, [profileState?.titles])

  return (
    <div className="tapdropdown" ref={ thisRef }>
      <div className="tapdropdownprofile" onClick={ handleActiveState }>
        { activeState === "input" ? (
          <div className="tapdropprofileInput">
            <Askinput 
              value={ profileState.searchname[0] } 
              onChange={(e) => profileDispatch({ type: ACTION.INPUT, payload: e.target })} 
              name={ dropperprofile?.name } 
              placeholder={ dropperprofile?.placeholder } 
              prefix={"ICsearch"} 
            />
          </div>
        ) : (
          <div className="dropperprofile" onClick={ () => setDropped(!dropped)}>
            { profileState.icnsrc && ( 
              <i className="material-icons dropperitemicns"> 
                { profileState.icnsrc } 
              </i>
            )}
            { profileState?.imgsrc && (
              <div className="dropperprofileimgwrapper">
                <img src={ profileState?.imgsrc } className="dropperprofileimg" alt={"pic"} />
              </div>
            )}     
            { profileState?.titles?.length === 2 ? (
              <div className="dropperprofiletext">   
                <div className="dropperprofiletitle"> { profileState?.titles[0]?.title } </div>
                <div className="dropperprofiletitle1">                  
                  { profileState?.titles[1]?.icnsrc && ( 
                    <i className="material-icons dropperprofileicn tiny blue-text"> 
                      { profileState?.titles[1]?.icnsrc } 
                    </i>
                  )}
                  { profileState?.titles[1]?.title } 
                </div>
              </div>
            ) : (
              <div className="dropperprofiletext">
                { profileState?.titles[0] } 
              </div>
            )}
          </div>
        )}
        <i className="material-icons tapdropicn" onClick={ () => setDropped(!dropped) }> { dropped ? "arrow_drop_up" : "arrow_drop_down" } </i>
      </div>
      { dropped && (
        <div className="dropperhiddenitems">
          { activeState === "input" && (                       
            (checksearchdropper && checksearchdropper?.length > 0) && (
              <>                
                <TapdropDroppers type={ "text" } dropitem={ { value: "COMMUNITIES" } } />              
                { checksearchdropper?.map((item: any, idm: number) => (
                  <TapdropDroppers 
                    handleclick={(e: any) => profileDispatch({ type: ACTION.CLICKED, payload: e.currentTarget })} 
                    dropitem={ item } 
                    key={ idm }
                  />  
                ))}
              </>
            )
          )}
          { droppers?.map((item: any, idx: number) => (                     
            item.type ? (
              <TapdropDroppers type={ "text" } dropitem={ item } key={ idx } />    
            ) : (
              activeState === "input" ? (                 
                <TapdropDroppers 
                  handleclick={ (e: any) => profileDispatch({ type: ACTION.CLICKED, payload: e.currentTarget })} 
                  dropitem={ item } 
                  key={ idx }
                />
              ) : activeState === "clicked" ? (
                <Conditionallink ifthis={ item.clickEvent === "link" } link={ item.link } key={ idx }>
                  <TapdropDroppers 
                    handleclick={ (e: any) => handleClicked(e,item) } 
                    dropitem={ item } 
                  />                                                                                           
                </Conditionallink>
              ) : activeState === "default" ? (
                <Conditionallink ifthis={ item.clickEvent === "link" } link={ item.link } key={ idx }>
                  <TapdropDroppers 
                    handleclick={ item.clickEvent === "event" ? item.event: null } 
                    dropitem={ item }                       
                  />
                </Conditionallink>
              ) : activeState === "current" && (
                <Conditionallink ifthis={ item.clickEvent === "link" } link={ item.link } key={ idx }>
                  <TapdropDroppers 
                    handleclick={ item.clickEvent === "event" ? item.event: null } 
                    dropitem={ item }                       
                  />
                </Conditionallink>              
              )
            ))
          )}         
        </div>
      )}     
    </div>
  )
}

export default Tapdrop;
