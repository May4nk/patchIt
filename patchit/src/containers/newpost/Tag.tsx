import React from "react";

//css & types
import "./css/tag.css";
import { tagpropstype } from "./types";

const Tag = (tagpropstype: tagpropstype) => {
  const { info, handleClick } = tagpropstype;

  return (
    <div
      className="tag waves-effect waves-light"
      onClick={(e: any) => handleClick(e, info.id)}
    >
      <i className="material-icons tagicn">local_offer</i>
      {info.name}
    </div>
  );
};

export default Tag;
