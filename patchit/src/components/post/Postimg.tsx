import React, { useState } from 'react';

//components
import Patpicer from '../html/Patpicer';

//css & types
import "./css/postimg.css";
import { postimgprops } from './types';

function Postimg(postimgprops: postimgprops) {
  const { postImgData } = postimgprops;

  //constants
  const totalimg: number | boolean = postImgData?.length > 1 && postImgData?.length;

  //states
  const [pic, setPic] = useState<string>("");
  const [showPic, setShowPic] = useState<boolean>(false);
  const [currentImg, setCurrentImg] = useState<number>(0);

  //handlers
  const prevImg = () => {
    if (currentImg !== 0) {
      setCurrentImg(currentImg - 1)
    }
  }

  const nextImg = () => {
    if (currentImg !== (Number(totalimg) - 1)) {
      setCurrentImg(currentImg + 1)
    }
  }

  const handleShowPic: (e) => void = (e) => {
    setPic(postImgData[currentImg].postSrc);
    setShowPic(true);
  }

  return (
    <>
      <div className="postimage">
        <img
          alt={"post_img"}
          className="postpic"
          onClick={handleShowPic}
          src={postImgData[currentImg].postSrc}
        />
        {totalimg && (
          <div className="imagectrl">
            <div className="totalimg"> {`${currentImg + 1}/${totalimg}`} </div>
            {currentImg + 1 > 1 && (
              <i className="material-icons leftimagebutton" onClick={prevImg}>
                chevron_left
              </i>
            )}
            {(currentImg + 1 !== totalimg) && (
              <i className="material-icons rightimagebutton" onClick={nextImg}>
                chevron_right
              </i>
            )}
          </div>
        )}
        {postImgData && (
          postImgData[currentImg]?.postCaption && (
            <div className="post_caption">
              {postImgData[currentImg]?.postCaption}
            </div>
          )
        )}
      </div>
      <Patpicer
        showPic={showPic}
        setShowPic={setShowPic}
        pics={[pic]}
      />
    </>
  )
}

export default Postimg;