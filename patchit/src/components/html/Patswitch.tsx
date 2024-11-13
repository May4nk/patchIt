import React from 'react';

//types
import { patswitchpropstype } from './types';

function Patswitch(patswitchprops: patswitchpropstype) {
  const { checked, onChange, name } = patswitchprops;

  return (
    <div className="switch">
      <label>
        <input
          type="checkbox"
          className="blue-text"
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <span className="lever"></span>
      </label>
    </div>
  )
}

export default Patswitch;