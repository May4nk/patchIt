import React, { useState, useEffect } from "react";

import "./css/askinput.css";
import { askinputprops } from "./types";

const Askinput = (askinputprops: askinputprops) => {
  
  const {
    placeholder,
    prefix,
    postfix,
    required,
    maxlength,
    name,
    type,
    onClick,
    onClickPostfix,
    onClickPrefixTab,
    onChange,
    onBlur,
    value
  } = askinputprops;
  
  const [inputlength, setInputLength] = useState<number>(0);
  
  //handler
  const handleInput: (e: any) => void = (e) => {
    setInputLength(e.target.value.length);
  }
  
  const prefixes = prefix?.split(" ");
  
  useEffect(() => {
    if(typeof value === "string" && value?.length === 0) {
      setInputLength(0);
    }
  },[value])
 
  return (    
    <>
      <div className="custominput">
        { prefixes && prefixes.length === 1 ? (
          prefixes[0].substr(0,2) === "IC" ? (
            <i className="material-icons inputprefix"> { prefixes[0].substr(2,) }</i>
          ) : prefixes[0].substr(0,3) === "TAB" ? (
            <div className="askinputtab" onClick={ onClickPrefixTab }>
              { prefixes[0].substr(3,) }
              <i className="material-icons askinputtabicn right"> clear </i>
            </div>
          ) : (
            <div className="inputprefix">{ prefixes[0] }</div>
          )
        ) : (prefixes && prefixes.length >= 2) && (
          <div className="custominputspace">
            { prefixes.map((pre: string, idx: number) => (
              pre.substr(0,2) === "IC" ? (
                <i className="material-icons inputprefix" key={ idx }> { pre.substr(2,) }</i>
              ) : pre.substr(0,3) === "TAB" ? (
                <div className="askinputtab" key={ idx } onClick={ onClickPrefixTab }>
                  { pre.substr(3,) }
                  <i className="material-icons askinputtabicn right"> clear </i>
                </div>
              ) : (
                <div className="inputprefix" key={ idx }>{ pre }</div>
              )          
            ))}
          </div>
        )}
        <input 
          className="askinput"
          placeholder={ placeholder }
          required={ required ? true : false }
          maxLength={ maxlength }
          type={ type }
          name={ name }
          onInput={ handleInput }
          onClick={ onClick }
          onChange={ onChange }
          onBlur={ onBlur }
          value={ value }
          autoComplete="off"
        />
        { maxlength && ( 
          <div className="inputlength">
            { inputlength }/{ maxlength } 
          </div>
        )}
        { (postfix && postfix !== null) && ( 
          postfix.substr(0,2) === "IC" ? (
            <i className="material-icons inputpostfix" onClick={ onClickPostfix }> 
              { postfix.substr(2,)} 
            </i>
          ) : (            
            <div className="inputpostfix" onClick={ onClickPostfix }>
              { postfix }
            </div>
          )
        )}
      </div>
    </>
  )
}

export default Askinput;
