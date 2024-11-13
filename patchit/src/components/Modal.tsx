import React from 'react';

//css, images & types
import "./css/modalcomponent.css";
let logo: string = require("../img/logo.png");
interface modalprops {
  txt?: string;
  head?: string;
  btntxt?: string;
  headlogo?: string;
  showModal: boolean;
  handleClose?: () => void
  handleUpdate?: () => void
}

function Modal(modalprops: modalprops) {
  const { btntxt, head, headlogo, txt, showModal, handleClose, handleUpdate } = modalprops;
  const show = showModal ? "block" : "none";

  return (
    <div className={show}>
      <div className="overlay1">
        <div className="modal">
          <div className="modallogowrapper">
            <img src={headlogo ? headlogo : logo} alt={"logo"} className="modallogo" />
          </div>
          {head && (
            <div className="modaltxt">
              {headlogo && (
                <i className="material-icons modaltxtlogo red-text">block</i>
              )}
              {head}
            </div>
          )}
          <div className="modalmetatxt">
            {txt}
          </div>
          <div className="btnwrapper">
            <div
              onClick={handleUpdate}
              className="actionbtn blue lighten-3 black-text waves-effect waves-light"
            >
              {btntxt || "update"}
            </div>
            <div
              onClick={handleClose}
              className="closebtn red lighten-3 black-text waves-effect waves-light"
            >
              close
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal;