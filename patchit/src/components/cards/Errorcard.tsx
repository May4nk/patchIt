import React, { useEffect, useState } from "react";

//css & types
import "./css/errorcard.css";
import { errorcardpropstype } from "./types";

const Errorcard = (errorcardprops: errorcardpropstype) => {
  const { icn, title, msgshowtime, message, setMessage } = errorcardprops;

  //states
  const [showError, setShowError] = useState(false);

  //handlers
  useEffect(() => {
    if (message.show) {
      setShowError(true)
    }
  }, [message])

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
        if (setMessage) setMessage("");
      }, msgshowtime || 3000)
    }
  }, [showError, msgshowtime])

  return (
    <div className={showError ? "block" : "none"}>
      <div className={
        message.status === 0
          ? "infocard"
          : message.status === 200
            ? "msgcard"
            : "errorcard"
      }>
        <div className={`errorcardheader`}>
          <i className="material-icons erroricn">
            {message.status === 0
              ? icn || "info_outline"
              : message.status === 200
                ? icn || "insert_emoticon"
                : icn || "error_outline"
            }
          </i>
          {message.status === 0
            ? "Patching..."
            : message.status === 200
              ? title || "Patched!!"
              : title || "Try again"
          }
        </div>
        <div className={`errorcardcontent`}>
          {message.message}
        </div>
      </div>
    </div>
  )
}

export default Errorcard;
