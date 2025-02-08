//css & types
import "./css/typepostimage.css";
import { postpreviewimgpropstype } from "./types";

const Typepostpreviewimage = (postpreviewimgpropstype: postpreviewimgpropstype) => {
  const { src, img_id, setImg, handleRemoveImage } = postpreviewimgpropstype;

  return (
    <div className={`imageprofile`}>
      <i
        onClick={() => handleRemoveImage(img_id)}
        className="material-icons right delete_icn"
      >
        delete_forever
      </i>
      <img
        id="postimg"
        alt={src.name}
        className={`prev${img_id}`}
        src={URL.createObjectURL(src)}
        onClick={() => setImg(img_id)}
      />
    </div>
  );
};

export default Typepostpreviewimage;
