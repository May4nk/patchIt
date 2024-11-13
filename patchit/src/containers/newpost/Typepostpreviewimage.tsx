import React from "react";

//css & types
import "./css/newpostimages.css";
import { postpreviewimgpropstype } from "./types";

const Typepostpreviewimage = (postpreviewimgpropstype: postpreviewimgpropstype) => {
  const { idx, src, img_id, setImg, handleRemoveImage } = postpreviewimgpropstype;

  return (
    <div className="imageprofile" >
      <i
        onClick={() => handleRemoveImage(img_id)}
        className="material-icons right delete_icn"
      >
        delete_forever
      </i>
      <img
        src={src}
        id="postimg"
        alt={src}
        onClick={() => setImg(idx)}
      />
    </div>
  );
};

export default Typepostpreviewimage;
