import React from 'react';

//components
import Patswitch from '../html/Patswitch';
import Patdrop from '../html/patdrop/Patdrop';

//types
import "./main.css";
import { settingtabpropstype } from './types';

function Settingtab(settingTabProps: settingtabpropstype) {
  const { title, metatitle, name, type, handleChange, value, dropperProfile, droppers } = settingTabProps;

  return (
    <div className="usettingitems">
      <div className="usettingitemlabels">
        <div className="usettingitemtitle"> {title} </div>
        <div className="usettingitemmetatitle thememetanhtext"> {metatitle} </div>
      </div>
      {type === "switch" ? (
        <Patswitch
          name={name!}
          checked={value!}
          onChange={handleChange!}
        />
      ) : type === "drop" && (
        <div className="usettingitemdrop">
          <Patdrop profile={dropperProfile!} droppers={droppers!} />
        </div>
      )}
    </div>
  )
}

export default Settingtab;