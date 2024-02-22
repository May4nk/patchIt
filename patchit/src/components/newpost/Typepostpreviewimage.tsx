import React from "react";

import "./css/newpostimages.css"; //css

interface postpreviewimgpropstype { 
  idx: number;
  src: string;
  img_id: number;
  handleRemoveImage: (img_id: number) => void;
  setImg: (id: number) => void;
} 

const Typepostpreviewimage = (postpreviewimgpropstype: postpreviewimgpropstype) => {
  const { idx, src, img_id, setImg, handleRemoveImage } = postpreviewimgpropstype;

  return (
    <div className="imageprofile" >
      <i className="material-icons right delete_icn" onClick={ () => handleRemoveImage(img_id) }> 
        delete_forever 
      </i>
      <img 
        src={ require(`../../img/${ src }`) } 
        id="postimg" 
        alt={ src } 
        onClick={ () => setImg(idx) }
      /> 
    </div> 
  );
};

export default Typepostpreviewimage;
