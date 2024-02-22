import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../common/hooks/useAuth";

//queries & mutations
import { INSERTUSERCOMMUNITY, REMOVEUSERCOMMUNITY }  from "../queries/infosection";

//css
import "./css/infoabout.css";
import { infoaboutprops } from "./types";
import { authcontexttype } from "../../context/types";
let bgpic: string = require("../../img/defaultbgpic.png");
let userdp: string = require(`../../img/loading_logo.png`);

const Infoabout = (infoaboutprops: infoaboutprops) => {   
  const { data, userdata } = infoaboutprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: number|null = user && Number(user["id"] || user["user_id"]);
  const userName: string|null = user && user["username"];
  const userRole: number|null = user && (user["role"] ? user["role"]?.id : user["role_id"]);
  //const joindate = (data && userdata) ? new Date(Number(data?.created_at)) : new Date();

  const [inCommunity, setInCommunity] = useState<boolean>(false);

  const [joincommunity] = useMutation(INSERTUSERCOMMUNITY);
  const [leavecommunity] = useMutation(REMOVEUSERCOMMUNITY);

  //handlers
  const handleCommunityJoin: () => void = () => {
    if(user) {
      setInCommunity(!inCommunity);
      if(inCommunity) {
        leavecommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: Number(data?.id)
            }
          }
        })
      } else {
        joincommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: Number(data?.id)
            }
          }
        }) 
      }      
    } else {
      navigate("/account/login");
    }
  }

  useEffect(() => {
    if(user) {
      if(!userdata) {
        const communityUsers = data?.users.map((usr: any) => (
          usr.user_id.id
        ));
        if(communityUsers?.includes(userId!)) {
          setInCommunity(true);
        }   
      }
    }
  }, [user, userdata, userId]);

  return(
    <div className="infocontent">
      <div className={ userdata ? "userinfobackgroundpic" : "infobackgroundpicwrapper" }>
       <img src={ bgpic} alt="background_pic" className={ userdata ? "userinfobackgroundpic" : "infobackgroundpic" } />  
      </div>
      { userdata && (
        <div className="userinfooverview">
          <div className="overviewuserpicwrapper"> 
            <img src={ userdp } alt="profile pic" className="useroverviewpic"/>
            <div className="userinfoname"> 
              { data?.username } 
            </div>
          </div>         
          { userName === data?.username ? (
            <Link to={`settings/profile`} className="usersettingicn">
              <i className="material-icons usersettingicn"> settings </i>
            </Link>
          ) : (          
            <div className="followbtnwrapper">
              <div className="waves-effect waves-light followbtn"> Chat </div>
              <div className="waves-effect waves-light followbtn"> follow </div>
            </div>        
          )}
        </div>
      )}
      { !userdata ? (
        <>
          <div className="infoaboutcontent">
            { data?.about || "Explore to know better."}
          </div>
          <div className="communitypageactionbtnwrapper" onClick={ handleCommunityJoin }>
            { inCommunity ? (
              <div className="waves-light waves-effect communitypageleavebtn"> 
                Leave
              </div>
            ) : (
              <div className="waves-light waves-effect communitypagejoinbtn"> 
                Join
                <i className="material-icons communitypagejoinbtnicn"> gavel </i>
              </div>
            )}
          </div>
          <div className="infoaboutpropswrapper"> 
            <div className="infoaboutprops"> 
              { data?.users?.length || 0}
              <i className="material-icons infoaboutpropsicn"> person_outline </i>
            </div>
            <div className="infoaboutprops"> 
              { data?.posts?.length || 0}
              <i className="material-icons blue-text infoaboutpropsicn"> center_focus_weak </i>
            </div>
          </div>      
          <div className="themecolor blue"></div>
        </>
       ) : (
        <>
          <div className="infoaboutpropswrapper"> 
            <div className="infoaboutprops"> 
              { data?.posts.length || 0}
              <i className="material-icons infoaboutpropsicn"> center_focus_weak </i>
            </div>
            <div className="infoaboutprops"> 
              1 
              <i className="material-icons infoaboutpropsicn"> blur_on</i>
            </div>
            <div className="infoaboutprops"> 
              # 2 years
            </div>
          </div>          
          { (userName === data?.username && userRole === 0) && (
            <div className="usersubtnwrapper" onClick={() => navigate("/su/profile")}>
              <div className="usersubtn waves-light waves-effect"> superuser </div>
            </div>
          )}                  
          <div className="infoaboutheading"> 
            <i className="material-icons infoicn tiny">sentiment_satisfied</i>       
            Me
            { userName === data?.username && (
              <i className="material-icons editcommunityprop tiny">edit</i>       
            )}
          </div>
          <div className="infoaboutcontent">
            { data?.about || "A guy with some powers."}
          </div>
        </>
       )}
    </div>
  );
}

Infoabout.defaultProps = {
  userdata: false
}

export default Infoabout;
