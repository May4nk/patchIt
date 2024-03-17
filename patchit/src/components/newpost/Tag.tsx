import React from "react";

import "./css/tag.css"; //css

interface tagpropstype {
  info: { id: number, name: string };
  handleClick: (e: any, tagId: number) => void;
}

const Tag = (tagpropstype: tagpropstype) => {
  const { info, handleClick } = tagpropstype;

  return (
    <div className="tag waves-effect waves-light" onClick={(e: any) => handleClick(e, info.id)}>
      <span>{ info.name }</span>
    </div>
  );
};

export default Tag;
