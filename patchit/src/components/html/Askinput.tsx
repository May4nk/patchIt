import React, { useState, useEffect } from "react";

//component
import Patchip from "./Patchip";

//css & types
import "./css/askinput.css";
import { askinputprops } from "./types";

const Askinput = (askinputprops: askinputprops) => {
  const {
    type,
    name,
    value,
    onBlur,
    postfix,
    onClick,
    onChange,
    required,
    prefixes,
    maxlength,
    placeholder,
    onClickPostfix,
    onClickPrefixTab,
  } = askinputprops;

  //states
  const [inputlength, setInputLength] = useState<number>(0);

  //handler
  const handleInput: (e: any) => void = (e) => {
    setInputLength(e.target.value.length);
  }

  useEffect(() => {
    if (typeof value === "string" && value?.length === 0) {
      setInputLength(0);
    }
  }, [value])

  return (
    <>
      <div className={type === "color" ? "custominputcolor" : "custominput"}>
        {prefixes && (
          <div className="custominputspace">
            {prefixes.map((pre: string, idx: number) => (
              pre.substring(0, 2) === "IC" ? (
                <i className="material-icons inputprefixicn" key={idx}>
                  {pre.substring(2,)}
                </i>
              ) : pre.substring(0, 3) === "TAB" ? (
                <Patchip
                  key={idx}
                  title={pre.substring(3,)}
                />
              ) : (
                <div className="inputprefix" key={idx}>
                  {pre}
                </div>
              )
            ))}
          </div>
        )}
        <input
          name={name}
          value={value}
          onBlur={onBlur}
          onClick={onClick}
          autoComplete="off"
          onChange={onChange}
          onInput={handleInput}
          maxLength={maxlength}
          type={type || "text"}
          placeholder={placeholder}
          required={required ? true : false}
          className={type === "color" ? "askinputcolor" : "askinput"}
        />
        {maxlength && (
          <div className="inputlength">
            {inputlength}/{maxlength}
          </div>
        )}
        {(postfix && postfix !== null) && (
          postfix.substring(0, 2) === "IC" ? (
            <i className="material-icons inputpostfix" onClick={onClickPostfix}>
              {postfix.substring(2,)}
            </i>
          ) : (
            <div className="inputpostfix" onClick={onClickPostfix}>
              {postfix}
            </div>
          )
        )}
      </div>
    </>
  )
}

export default Askinput;
