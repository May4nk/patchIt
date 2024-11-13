import React, { useEffect, useState } from "react";

import Patdrop from "../../components/html/patdrop/Patdrop";
import Askinput from "../../components/html/Askinput";

//css
import "./css/suqueryform.css";
import { suqueryformprops, tablecolumntype, wheretype } from "../types";
import { droppertype } from "../../components/html/patdrop/types";
import {
  defaultprofile,
  columnprofile,
  orderprofile,
  rolefiltercolumns,
  postfiltercolumns,
  userfiltercolumns,
  chatfiltercolumns,
  communityfiltercolumns,
  categoryfiltercolumns,
} from "../../constants/patdropconst";

const Suqueryform = (suqueryformprops: suqueryformprops) => {
  const {
    tablename,
    handleSubmit,
    where,
    setWhere,
    limitState,
    setLimitState,
    limit,
    setLimit,
    orderState,
    setOrderState,
    orderby,
    setOrderBy
  } = suqueryformprops;

  const tablecolumns: tablecolumntype = {
    "roles": rolefiltercolumns,
    "posts": postfiltercolumns,
    "users": userfiltercolumns,
    "chats": chatfiltercolumns,
    "communities": communityfiltercolumns,
    "categories": categoryfiltercolumns,
  }

  const [current, setCurrent] = useState(0);

  const orderdroppers: droppertype[] = [
    { title: "ascending", state: "CLICKED", event: () => handleOrder("order", "asec") },
    { title: "descending", state: "CLICKED", event: () => handleOrder("order", "desc") },
  ];

  const nullsdroppers: droppertype[] = [
    { title: "last", state: "CLICKED", event: () => handleOrder("nulls", "last") },
    { title: "first", state: "CLICKED", event: () => handleOrder("nulls", "first") },
  ];

  const columndroppers: droppertype[] = [...tablecolumns[tablename as keyof typeof tablecolumns] ?
    tablecolumns[tablename as keyof typeof tablecolumns].map((drop: droppertype) => (
      { ...drop, event: () => handleWhere(current, "column", drop.title) }
    ))
    : []];

  //handlers
  const addOrder: () => void = () => {
    setOrderState(!orderState);
    setOrderBy([{ order: "", column: "", nulls: "last" }]);
  }

  const handleOrder: (name: string, value: string) => void = (name: string, value: string,) => {
    setOrderBy([{ ...orderby[0], [name]: value }]);
  }

  const addLimit: () => void = () => {
    setLimitState(!limitState);
    setLimit(0);
  }

  const addWhere: () => void = () => {
    setWhere([...where, { column: "", value: "" }])
  }

  const handleWhere: (
    indx: number,
    name: string,
    value: string
  ) => void = (indx: number, name: string, value: string) => {
    const tempWhere = [...where];
    (tempWhere[indx] as any)[name] = value;
    setWhere(tempWhere);
  }

  const handleDeleteWhere = (indx: number) => {
    console.log(indx);
    const temparr = [...where];
    temparr.splice(indx, 1);
    setWhere(temparr);
    console.log("where", where);
    const temp = where[indx];
    console.log("splice", where.splice(indx, 1));
    console.log("where", where);
    console.log(temp);
  }

  useEffect(() => {
    setWhere([]);
    setLimitState(false);
    setLimit(0);
    setOrderState(false);
    setOrderBy([]);
  }, [tablename])

  console.log(where);

  return (
    <form className="suform" onSubmit={handleSubmit}>
      <div className="suformtitle">Resolve your query</div>
      <div className="querypanels">
        <div className="queryformat">
          <div className="query">
            Select &nbsp; &nbsp; * &nbsp; &nbsp; from &nbsp; &nbsp;
            <span className="querytable">{tablename}</span> &nbsp;
            {where.length < 1 && !orderState && !limitState ? (
              <span>;</span>
            ) : (
              <>
                {where.map((value: wheretype, idx: number) => (
                  <div className="metaqueryformat" key={idx}>
                    <div className="metaquery">
                      .where  &nbsp; &nbsp;
                      <div className="queryoptions" onClick={() => setCurrent(idx)}>
                        <Patdrop profile={{ title: value.column || "column" }} droppers={columndroppers} />
                      </div>
                      &nbsp; &nbsp;is&nbsp; &nbsp;
                      <div className="queryask">
                        <Askinput
                          name={"ask"}
                          placeholder={"..."}
                          value={value.value}
                          onChange={(e: any) => handleWhere(current, "value", e.target.value)}
                        />
                      </div>
                    </div>
                    <i className="material-icons tiny red-text deletequery" onClick={() => handleDeleteWhere(idx)}>delete</i>
                  </div>
                ))}
                {orderState && (
                  <div className="metaqueryformat">
                    <div className="metaquery">
                      .order  &nbsp; by &nbsp;
                      <div className="queryoptions">
                        <Patdrop profile={columnprofile} droppers={columndroppers} />
                      </div>
                      &nbsp; &nbsp; in &nbsp; &nbsp;
                      <div className="queryoptions">
                        <Patdrop profile={orderprofile} droppers={orderdroppers} />
                      </div>
                      &nbsp; &nbsp; nulls &nbsp; &nbsp;
                      <div className="queryoptions">
                        <Patdrop profile={defaultprofile} droppers={nullsdroppers} />
                      </div>
                    </div>
                  </div>
                )}
                {limitState && (
                  <div className="metaqueryformat">
                    <div className="metaquery">
                      .limit  &nbsp; &nbsp;
                      <div className="queryask">
                        <Askinput
                          type={"number"}
                          name={"limit"}
                          onChange={(e) => setLimit(Number(e.target.value))}
                          placeholder={"query limit"}
                          value={limit}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="queryactions">
          <div className="waves-effect waves-light queryvariables">
            Delete
          </div>
          <div className="waves-effect waves-light queryvariables" onClick={addWhere}>
            where
          </div>
          <div className={`waves-effect waves-light queryvariables ${limitState && "active"}`} onClick={() => addLimit()}>
            limit
          </div>
          <div className={`waves-effect waves-light queryvariables ${orderState && "active"}`} onClick={() => addOrder()}>
            orderBy
          </div>
        </div>
      </div>
      <button className="waves-effect waves-light querybtn" type="submit">
        execute
      </button>
    </form>
  )
}

export default Suqueryform;
