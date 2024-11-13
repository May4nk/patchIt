import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
//components
import Sidenavtab from "./Sidenavtab";
import Loadingpage from "../Loadingpage";
//queries
import { GETCATEGORIES } from "./queries";
//css & types
import "./css/sidenav.css";
import { categorytype } from "./types";

const Sidenav = () => {
  const [getCategories, { data, loading }] = useLazyQuery(GETCATEGORIES);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <div className="sidenavheaders"> home </div>
      <Link to="/home" >
        <Sidenavtab icon="home" colname="Home" />
      </Link>
      <Link to="c/popular" >
        <Sidenavtab icon="whatshot" colname="Popular" />
      </Link>
      <div className="sidenavheaders"> wander </div>
      <div className="sidenavcategories">
        {!loading ? (
          data?.listCategories.map((category: categorytype, idx: number) => (
            <Sidenavtab
              key={idx}
              icon={category.categoryicon}
              colname={category.categoryname}
              category={true}
            />
          ))
        ) : (
          <Loadingpage />
        )}
      </div>
    </>
  );
};

export default Sidenav;
