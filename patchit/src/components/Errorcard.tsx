import React, { useEffect, useState } from "react";

//css
import "./css/errorcard.css";

interface errorcardprops {
  msg? : boolean;
  title? : string;
  message? : string;
  msgshowtime? : number;
  err? : boolean;
}

const Errorcard = (errorcardprops: errorcardprops) => {
  //props
  const { msg, title, message, msgshowtime, err } = errorcardprops;
  
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if(err || msg) {
      setShowError(true)
    }
  },[err, msg])
  
  useEffect(() => {
    if(showError) {
      setTimeout(() => {
        setShowError(false);
      },msgshowtime || 3000)
    }
  },[showError, msgshowtime])

  return (
    <div className={ showError ? "block": "none"}>
      <div className={ msg ? "msgcard" : "errorcard" }>
        <div className="errorcardheader">
          <i className="material-icons erroricn"> { msg ? "insert_emoticon" : "warning" } </i>
          { msg ? title || "Patched!!" : title || "Try again" }
        </div>
        <div className="errorcardcontent"> 
          { message }
        </div>
      </div>
    </div>
  )
}

export default Errorcard;
