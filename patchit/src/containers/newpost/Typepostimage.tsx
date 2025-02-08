import React, { useEffect, useState } from "react";

//components
import Askinput from "../../components/html/Askinput";
import Typepostpreviewimage from "./Typepostpreviewimage";

//css & types
import "./css/typepostimage.css";
import { posttypeimageprops, postimagetype } from "./types";

const Posttypeimage = (posttypeimageprops: posttypeimageprops) => {
  const {
    images,
    setImages,
  } = posttypeimageprops;

  //states
  const [currentpreviewImg, setCurrentpreviewImg] = useState<number | null>(null);

  //handlers
  const handleRemovePreviewImg: (imgobjid: number) => void = (imgobjid: number) => {
    setImages({ type: "DEL_IMAGE", imgIdx: imgobjid });

    if (currentpreviewImg === imgobjid) {
      setCurrentpreviewImg(images.length > 0 ? Math.max(0, imgobjid - 1) : null)
    } else if (currentpreviewImg !== null && currentpreviewImg > imgobjid) {
      setCurrentpreviewImg(currentpreviewImg - 1);
    }
  }

  const handlePreview = (previewIdx: number) => {
    const currentHighlightedImg = document.querySelector(`.previewimg`);
    if (currentHighlightedImg) {
      currentHighlightedImg.classList.remove("previewimg");
    }

    const newHighlightedImg = document.querySelector(`.prev${previewIdx}`);
    if (newHighlightedImg) {
      newHighlightedImg.classList.add("previewimg");
    }
  }

  const handlePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages({
        type: "ADD_IMAGES",
        images: [
          ...images,
          ...([...files].map((file: File, idx: number) => ({
            postCaption: "",
            postLink: "",
            postSrc: file
          })))
        ]
      })

      const currentFileIdx: number = (images.length + files.length) - 1;
      setCurrentpreviewImg(currentFileIdx);
    }
  };

  const handleChangepostimgdata: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let tempImages: postimagetype[] = [...images];
    if (currentpreviewImg !== null) {
      tempImages[currentpreviewImg][e.target.name] = e.target.value;
      setImages({
        type: "ADD_IMAGES",
        images: tempImages
      })
    }
  }

  useEffect(() => {
    if (currentpreviewImg !== null) {
      handlePreview(currentpreviewImg);
    }
  }, [currentpreviewImg])

  return (
    <div className="newpostpic">
      <input
        id="img"
        multiple
        type="file"
        name="content"
        accept="image/* video/*"
        onChange={handlePic}
      />
      {images.length < 1 && (
        <label htmlFor="img">
          <span className="uploadpic">
            "Upload pic"
          </span>
        </label>
      )}
      {images.length > 0 && (
        <div className="multiimageprofiles">
          <div className="multiimage">
            {images.map((img: postimagetype, idx: number) => (
              <Typepostpreviewimage
                key={idx}
                img_id={idx}
                src={img.postSrc}
                setImg={setCurrentpreviewImg}
                handleRemoveImage={handleRemovePreviewImg}
              />
            ))}
            <label htmlFor="img">
              <span id="uploadpic">
                <i className="material-icons">add</i>
              </span>
            </label>
          </div>
          {currentpreviewImg !== null && (
            <div className="currentimage">
              <div className="imageoutline">
                <img
                  id="currentimg"
                  src={URL.createObjectURL(images[currentpreviewImg]?.postSrc)}
                  alt="We are unable to upload your pic."
                />
              </div>
              <div className="currentimagetitle">
                <div className="currentpostcaption">
                  <Askinput
                    maxlength={80}
                    name={"postCaption"}
                    placeholder={"Add Caption"}
                    onChange={handleChangepostimgdata}
                    value={images[currentpreviewImg]?.postCaption}
                  />
                </div>
                <div className="currentpostcaption">
                  <Askinput
                    maxlength={100}
                    name={"postLink"}
                    placeholder={"Add a Link"}
                    onChange={handleChangepostimgdata}
                    value={images[currentpreviewImg]?.postLink}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Posttypeimage;
