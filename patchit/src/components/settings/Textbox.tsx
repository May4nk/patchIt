import React from 'react';

//types & css
import "./main.css";
import { textboxpropstype } from './types';

function Textbox(textboxprops: textboxpropstype) {
  const { setShowTextBox, placeholder, name, value, handleChange, handleUpdate } = textboxprops;

  //handlers
  const handleDefault: () => void = () => {
    setShowTextBox(false);
  }

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
        <div
          onClick={handleDefault}
          className="waves-effect waves-light black-text red lighten-2 socialactionbtn"
        >
          cancel
        </div>
        <div
          onClick={handleBoxUpdates}
          className="waves-effect waves-light black-text blue lighten-3 socialactionbtn"
        >
          update
        </div>
      </div>
    </div>
  )
}

export default Textbox;