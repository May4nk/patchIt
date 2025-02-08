import React from 'react';

//components
import Patbtn from '../html/Patbtn';

//types & css
import "./main.css";
import { textboxpropstype } from './types';

function Textbox(textboxprops: textboxpropstype) {
  const { setShowTextBox, placeholder, name, value, handleChange, handleUpdate } = textboxprops;

  //handlers
  const handleBoxUpdates: () => void = () => {
    handleUpdate();
    setShowTextBox(false);
  }

  return (
    <div className="textbox">
      <div className="privacyboxtitle">
        Write your thoughts
        <div className="textboxactions">
          <i className="material-icons textboxactionicns">perm_identity</i>
          <i className="material-icons textboxactionicns">edit</i>
        </div>
      </div>
      <div className="textboxbody">
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          className="textboxarea"
          placeholder={placeholder || "Description..."}
        ></textarea>
      </div>
      <div className="textboxfooter">
        <Patbtn
          text={"cancel"}
          state="clear"
          handleClick={() => setShowTextBox(false)}
        />
        <Patbtn
          text={"update"}
          state="selected"
          handleClick={handleBoxUpdates}
        />
      </div>
    </div>
  )
}

export default Textbox;