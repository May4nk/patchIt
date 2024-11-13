import React, { useState } from "react";
import { Link } from "react-router-dom";

//css & types
import "./css/zeropostcard.css";
import { zeropostcardcontenttype, zeropostcardpropstype } from "./types";

const Zeropostcard = (zeropostcardprops: zeropostcardpropstype) => {
  const { title, content, openstate } = zeropostcardprops;

  const [open, setOpen] = useState<boolean>(openstate);

  return (
    <div className="zeropostcard">
      <div className="zeropostcardheader" onClick={content && (() => setOpen(!open))}>
        <div className="zeropostcardheadertitle">
          {title || "No patch yet!!"}
        </div>
        {content && (
          <i className="material-icons zeropostcardicn">
            {open ? "arrow_drop_up" : "arrow_drop_down"}
          </i>
        )}
      </div>
      {open && (
        <div className="zeropostcardcontent">
          {content && content.map((ctnt: zeropostcardcontenttype, idx: number) => (
            <div className="zeropostcardheading" key={idx}>
              <div className="zeropostcardheadingtitle">
                {ctnt.title || "Start your journey from here"}
                {ctnt.unlock && (
                  <i className="material-icons zeropostheadingunlockitem blue-text">
                    {ctnt.unlock || "blur_on"}
                  </i>
                )}
              </div>
              <div className="zeropostcardheadingcontent">
                {ctnt.content}
              </div>
              {(ctnt.btntxt && ctnt.link) && (
                <Link to={ctnt.link} className="waves-effect waves-light zeropostcreatebtn" onClick={ctnt.onClick}>
                  {ctnt.btntxt}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Zeropostcard.defaultProps = {
  openstate: true
}

export default Zeropostcard;
