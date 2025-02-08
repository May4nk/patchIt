import React from 'react';

//css & types
import "./css/patradio.css";
import { VOIDFUNC } from '../../utils/main/types';
interface patradiopropstype {
  id: string;
  value: string;
  name: string;
  title: string;
  metatitle?: string;
  checked?: boolean;
  required?: boolean;
  handleChange: VOIDFUNC;
}

function Patradio(patradioprops: patradiopropstype) {
  const { id, value, name, title, metatitle, handleChange, checked = false, required = false } = patradioprops;

  return (
    <label htmlFor={id}>
      <input
        id={id}
        type="radio"
        required={required}
        name={name}
        value={value}
        onChange={handleChange}
        checked={checked}
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