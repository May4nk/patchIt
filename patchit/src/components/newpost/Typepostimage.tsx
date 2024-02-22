import React from "react";

//components
import Typepostpreviewimage from "./Typepostpreviewimage";
import Askinput from "../html/Askinput";

import "./css/typepostimage.css"; //css

interface imagetype {
  id: number;
  postSrc : string;
  postCaption: string;
  postLink: string;
}

interface posttypeimageprops {
  image : imagetype[];
  currentpreviewImage: number;
  onChange? : (e: React.ChangeEvent<HTMLInputElement>) => void;
  setImage : React.Dispatch<React.SetStateAction<imagetype[]>>;
  setCurrentpreviewImage: React.Dispatch<React.SetStateAction<number>>;
  handleRemovepreviewImage: (img_id: number) => void;
}

const Posttypeimage = (posttypeimageprops: posttypeimageprops) => {
  const { 
    onChange, 
    image, 
    setImage, 
    currentpreviewImage, 
    setCurrentpreviewImage, 
    handleRemovepreviewImage 
  } = posttypeimageprops;
  
  const setImg: (id: number) => void = (id: number) => {
    setCurrentpreviewImage(id);
  }
 
  const handleChangepostimgdata: (e: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {   
    let tempImage: imagetype[] = [ ...image ];
    (tempImage[currentpreviewImage] as any)[e.target.name as keyof imagetype] = e.target.value;
    setImage(tempImage);
  }
  
  return(
    <div className="postpic"> 
      <input type="file" 
        accept="image/*" 
        id="img" 
        onChange={ onChange }
        name="content"                    
        required
      />  
      { image.length <= 1 && (
        <label htmlFor="img">
          <span className="uploadpic"> 
            "Click me to upload pic" 
          </span>
        </label>
      )}
      { image.length > 1  && (                         
        <div className="multiimageprofiles">
          <div className="multiimage">
            { image.slice(1, ).map((img: imagetype, idx: number) => (               
              <Typepostpreviewimage 
                src={ img.postSrc }  
                key={ idx } 
                img_id={ img.id } 
                setImg={ setImg } 
                handleRemoveImage={ handleRemovepreviewImage } 
                idx={ idx+1 }
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
              <img id="currentimg" 
                src={ require(`../../img/${ image[currentpreviewImage]?.postSrc }`) } 
                alt="We are unable to upload your pic." 
              /> 
            </div>
            <div className="currentimagetitle">
              <div className="currentpostcaption">
                <Askinput 
                  value={ image[currentpreviewImage]?.postCaption } 
                  placeholder={ "Add a caption" } 
                  name={ "postCaption" } 
                  onChange={ handleChangepostimgdata } 
                  maxlength={ 20 } 
                />
              </div>
              <div className="currentpostcaption">
                <Askinput 
                  value={ image[currentpreviewImage]?.postLink } 
                  placeholder={ "Add a Link" } 
                  name={ "postLink" } 
                  onChange={ handleChangepostimgdata } 
                  maxlength={ 100 } 
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
