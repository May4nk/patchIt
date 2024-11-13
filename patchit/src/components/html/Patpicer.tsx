import React, { useState } from 'react';

//css & types
import "./css/patpicer.css";
import { patpicerpropstype } from './types';

function Patpicer(patpicerprops: patpicerpropstype) {
  const { showPic, setShowPic, pics } = patpicerprops;
  const active: string = showPic ? "block" : "none";

  //states
  const [currentPic, setCurrentPic] = useState<number>(0);

  return (
    <div className={active}>
      <div className="showpicoverlay" >
        <div className="closeshowpicbox">
          <i className="material-icons" onClick={() => setShowPic(false)}>
            clear
          </i>
        </div>
        <div className="showpicbox">
          {(pics.length > 1 && currentPic !== 0) && (
            <i
              className="material-icons patpicericn"
              onClick={() => currentPic > 0 && setCurrentPic(currentPic - 1)}
            >
              chevron_left
            </i>
          )}
          <div className="showpicwrapper">
            <img
              src={pics[currentPic]}
              alt="pic"
              className="showpic"
            />
          </div>
          {(pics.length > 1 && currentPic < pics.length - 1) && (
            <i
              className="material-icons patpicericn"
              onClick={() => currentPic < pics.length - 1 && setCurrentPic(currentPic + 1)}
            >
              chevron_right
            </i>
          )}
          <div className="previewpics">
            {pics.map((pic: string, idx: number) => (
              <img
                key={idx}
                src={pic}
                alt="preview_pic"
                onClick={() => setCurrentPic(idx)}
                className="showpicpreview waves-effect waves-light"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Patpicer