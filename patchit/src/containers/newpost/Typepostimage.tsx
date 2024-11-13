import React from "react";

//components
import Askinput from "../../components/html/Askinput";
import Typepostpreviewimage from "./Typepostpreviewimage";

//css & types
import "./css/typepostimage.css";
import { posttypeimageprops, imagetype } from "./types";

const Posttypeimage = (posttypeimageprops: posttypeimageprops) => {
  const {
    onChange,
    image,
    setImage,
    currentpreviewImage,
    setCurrentpreviewImage,
    handleRemovepreviewImage
  } = posttypeimageprops;

  //handlers
  const setImg: (id: number) => void = (id: number) => {
    setCurrentpreviewImage(id);
  }

  const handleChangepostimgdata: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let tempImage: imagetype[] = [...image];
    (tempImage[currentpreviewImage] as any)[e.target.name as keyof imagetype] = e.target.value;
    setImage(tempImage);
  }

  return (
    <div className="newpostpic">
      <input
        id="img"
        required
        type="file"
        name="content"
        accept="image/*"
        onChange={onChange}
      />
      {image.length <= 1 && (
        <label htmlFor="img">
          <span className="uploadpic">
            "Upload pic"
          </span>
        </label>
      )}
      {image.length > 1 && (
        <div className="multiimageprofiles">
          <div className="multiimage">
            {image.slice(1,).map((img: imagetype, idx: number) => (
              <Typepostpreviewimage
                key={idx}
                idx={idx + 1}
                img_id={img.id}
                setImg={setImg}
                src={img.postSrc}
                handleRemoveImage={handleRemovepreviewImage}
              />
            ))}
            <label htmlFor="img">
              <span id="uploadpic">
                <i className="material-icons">add</i>
              </span>
            </label>
          </div>
          <div className="currentimage">
            <div className="imageoutline">
              <img
                id="currentimg"
                src={image[currentpreviewImage]?.postSrc}
                alt="We are unable to upload your pic."
              />
            </div>
            <div className="currentimagetitle">
              <div className="currentpostcaption">
                <Askinput
                  maxlength={20}
                  name={"postCaption"}
                  placeholder={"Add a caption"}
                  onChange={handleChangepostimgdata}
                  value={image[currentpreviewImage]?.postCaption}
                />
              </div>
              <div className="currentpostcaption">
                <Askinput
                  maxlength={100}
                  name={"postLink"}
                  placeholder={"Add a Link"}
                  onChange={handleChangepostimgdata}
                  value={image[currentpreviewImage]?.postLink}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Posttypeimage;
