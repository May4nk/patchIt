import React from "react";
import { Link } from "react-router-dom";

interface conditionllinkprops {
  children: any;
  link: string;
  ifthis: boolean;
}

const Conditionallink = (conditionllinkprops: conditionllinkprops) => {
  const { children, link, ifthis } = conditionllinkprops;

  return (
    ifthis ? (
      <Link to={link}>
        {children}
      </Link>
    ) : (
      <>
        {children}
      </>
    )
  );
};

export default Conditionallink;
