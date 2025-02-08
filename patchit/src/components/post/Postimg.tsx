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
  const [loading, setLoading] = useState<boolean>(false);
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
    setPic(postImgData[currentImg]?.postSrc);
    setShowPic(true);
  }

  return (
    <>
      <div className="postimage">
        {!loading ? (
          <>
            <img
              alt={"post_img"}
              className="postpic"
              onClick={handleShowPic}
              onError={() => {
                console.log("error")
                setLoading(true)
              }}
              src={postImgData[currentImg]?.postSrc}
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
          </>
        ) : (
          <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
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