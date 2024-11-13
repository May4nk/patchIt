import React from 'react';

//css & types
import "./css/patradio.css";
interface patradiopropstype {
  id: string;
  value: string;
  name: string;
  title: string;
  metatitle?: string;
  handleChange: (e?: any) => void;
}

function Patradio(patradioprops: patradiopropstype) {
  const { id, value, name, title, metatitle, handleChange } = patradioprops;

  return (
    <label htmlFor={id}>
      <input
        required
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="with-gap blue"
      />
      <span className="patradiotitle">
        {title}
      </span>
      {metatitle && (
        <span className="patradiometatitle">
          {metatitle}
        </span>
      )}
    </label>
  )
}

export default Patradio;