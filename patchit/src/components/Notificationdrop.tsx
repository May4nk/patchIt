import React, { useRef } from "react";

import "./css/notificationdrop.css";//css

const pic = require("../img/unnamed.jpg"); //change

const Notificationdrop = ({ showNotificationdrop, setShowNotificationdrop, data, icn }: any) => {
  const thisRef = useRef<HTMLDivElement>(null);

  //handler
  const closeDrop = (e: any) => {   
    if(thisRef.current && showNotificationdrop && !thisRef.current.contains(e.target)){
      setShowNotificationdrop(false)
    }
  }
  document.addEventListener('mousedown', closeDrop);

  return (
    <div className="notificationdrop" ref={ thisRef }>   
      <i className="material-icons loginuseraccessbtnsicn" onClick={() => setShowNotificationdrop(!showNotificationdrop)}>
        { icn }
      </i>
      { showNotificationdrop && (
        <div className="notificationdropcontent">
          <div className="notificationdropheader"> 
            <div className="notificationdropheadertitle"> Notifications </div>
            <div className="notificationdropheaderactions">
              <div className="notificationdropmessages"> Patmails </div>
              <i className="material-icons notificationdropheadericn">assignment_late </i>
              <i className="material-icons-outlined notificationdropheadericn">settings </i>
            </div>
          </div>
          <div className="notificationdropbody">            
            <div className="notifies waves-effect waves-light">
              <div className="notifiespicwrapper"> 
                <img src={ pic } className="notifiespic" alt={ "notification_pic"}/> 
              </div>
              <div className="notifiesbody">
                <div className="notifiestitle"> Friend </div>
                <div className="notifiesmessage"> You got a new message. </div>
              </div>
              <div className="notifiesactions">
                <i className="material-icons"> more_horiz </i>
              </div>
            </div>
            <div className="notifies">
              <div className="notifiespicwrapper"> 
                <img src={ pic } className="notifiespic"  alt={"pic"}/> 
              </div>
              <div className="notifiesbody">
                <div className="notifiestitle"> Patcoin </div>
                <div className="notifiesmessage"> You got a new message. </div>
              </div>
              <div className="notifiesactions">
                <i className="material-icons"> more_horiz </i>
              </div>
            </div>
          </div>
        </div>
      )}
    </div> 
  )
}

export default Notificationdrop;
