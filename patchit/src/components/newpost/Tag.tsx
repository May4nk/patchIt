import React from "react";

import "./css/tag.css"; //css

interface tagpropstype {
  title: string;
  handleClick: (e: any, title: string) => void;
}

const Tag = (tagpropstype: tagpropstype) => {
  const { title, handleClick } = tagpropstype;

  return (
    <div className="tag waves-effect" onClick={(e: any) => handleClick(e, title)}>
      <span>{ title }</span>
    </div>
  );
};

export default Tag;
