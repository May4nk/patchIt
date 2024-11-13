import React from "react";
import { Link } from "react-router-dom";

//css & types
import "./css/popularpagecard.css";
import { popularcardpropstype } from "./types";
import { newpolltype } from "../../containers/newpost/types";

const Popularpagecard = (popularcardprops: popularcardpropstype) => {
  const { data } = popularcardprops;
  const { id, content, type, title } = data;

  //handlers
  let cardContent = content && (type === "IMAGE" || type === "POLL") ?
    JSON.parse(content)
    : (type === "BLOG" || type === "LINK") &&
    content;

  return (
    <Link to={`/post/${id}`} className="popularpostcard hoverable">
      {type === "IMAGE" ? (
        <>
          <img src={cardContent[0].postSrc} className="popularpostcardpix" alt="sample_pic" />
          <div className="popularpostcardtext">
            {title?.length > 30 ? title.slice(0, 30) + "..." : title}
          </div>
        </>
      ) : type === "POLL" ? (
        <div className="popularpostcardblog">
          <div className="popularpostcardblogtitle">
            {title?.length > 30 ? title.slice(0, 30) + "..." : title}
          </div>
          <div className="topcontentpoll">
            {cardContent.map((polls: newpolltype, idx: number) => (
              <div className="popularpostcardpolltext" key={idx}>
                {polls.value}
              </div>
            ))}
          </div>
        </div>
      ) : (type === "BLOG" || type === "LINK") && (
        <div className="popularpostcardblog">
          <div className="popularpostcardblogtitle">
            {title?.length > 30 ? title.slice(0, 30) + "..." : title}
          </div>
          <div className="popularpostcardblogcontent">
            {cardContent?.length > 350 ? cardContent?.slice(0, 355) + "..." : cardContent}
          </div>
        </div>
      )}
    </Link>
  );
}

export default Popularpagecard;
