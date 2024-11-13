import React, { useEffect } from 'react';

import { changeToThemeColor } from '../../utils/themeopx';

//css & types
import "./css/infodescription.css"
interface infodescriptionprops {
  title?: string;
  info: string;
  theme?: string;
}

function Infodescription(infodescriptionprops: infodescriptionprops) {
  const { title, info, theme } = infodescriptionprops;

  useEffect(() => {
    if (theme) {
      changeToThemeColor(theme);
    }
  }, []);

  return (
    <div className="info">
      <div className="descinfotitle themecolor">
        {title || "What we think we are..."}
      </div>
      <div className="descinfotxt thememetanhtext">
        {info}
      </div>
    </div>
  )
}

export default Infodescription;