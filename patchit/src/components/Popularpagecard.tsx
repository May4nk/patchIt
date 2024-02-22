import React from "react";
import { Link } from "react-router-dom";

import "./css/popularpagecard.css";
import { popularcardtype } from "../containers/types/popular";

type popularcardprops = {
  data: popularcardtype 
}

const Popularpagecard = ({ data }: popularcardprops) => {

  const { id, content, type, title } = data;

  return(
    <Link to={`/post/${id}`} className="topcontentbox hoverable">     
      { type === "IMAGE" ? (
        <>
          <img src={require(`../img/${ JSON.parse(content)[0].postSrc}`)} className="topcontentpix" alt="sample_pic"/> 
          <div className="topcontenttext">
            { title.length > 70 ? title.slice(0,73)+"..." : title }
          </div>
        </>
      ):  type === "POLL" ? (
        <div className="topcontentblog">
          <div className="topcontentblogtitle">
            { title.length > 70 ? title.slice(0,70)+"..." : title }
          </div>
          <div className="topcontentpoll"> 
            {JSON.parse(content).map((polls: any, idx: number) => (
              <div className="topcontentpolltext" key={idx}>
                { polls.poll }
              </div>
            ))}
          </div>
        </div>
      ) : (type === "BLOG" || type === "LINK") && (
        <div className="topcontentblog">
          <div className="topcontentblogtitle">
            { title.length > 70 ? title.slice(0,70)+"..." : title }
          </div>
          <div className="topcontentblogcontent"> 
            { content && content.trimStart() }
          </div>
        </div>
      )}
    </Link>
  );
}

export default Popularpagecard;
