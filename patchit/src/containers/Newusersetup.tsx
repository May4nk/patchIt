import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { useAuth, useLogged } from "../common/hooks/useAuth";

//components
import Askinput from "../components/html/Askinput";
import Loadingpage from "../components/Loadingpage";

//queries
import { GETPOPULARCOMMUNITIES, UPDATEUSER, JOINCOMMUNITYINBATCH } from "./queries/newusersetup";

//css
import "./css/newusersetup.css";
import { newusersetuptype, newusersetupprops, selectedcommunitytype, communitytype } from "./types/newusersetuptypes";
import { authcontexttype } from "../context/types";

const logo:string = require("../img/logo.png");

const Newusersetup = (newusersetupprops: newusersetupprops) => {
  const { newUser } = newusersetupprops;
  const active:string = newUser ? "block" : "none" ;
  
  const navigate = useNavigate();
  const { updateLoggedUser } = useLogged();
  const { user }: authcontexttype = useAuth(); 
  const userId:number|null = user && Number(user["id"] || user["user_id"]);

  //states 
  const [level, setLevel] = useState<number>(0);
  const [userCommunities, setUserCommunities] = useState<selectedcommunitytype[]>([]);
  const [error, setError] = useState<string>("");
  const [usersetup, setUsersetup] = useState<newusersetuptype>({ 
    id: userId!,
    about: "",
    new_user: false,
    background_pic: "",
    profile_pic: ""
  }); 

  //queries
  const { loading, data } = useQuery(GETPOPULARCOMMUNITIES);
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATEUSER);
  const [joincommunity] = useMutation(JOINCOMMUNITYINBATCH);

  //handlers
  const handleUserinputs: (e: any) => void = (e) => {
    setUsersetup({
      ...usersetup,
      [e.target.name]: e.target.value
    })
  }
 
  const handleUpdateCommunities:(e: any, communityObj: communitytype) => void = (e, communityObj) => {
    if(e.currentTarget.classList.contains("selectedcommunity")) {
      e.currentTarget.classList.remove("selectedcommunity");
      const tempUserCommunities = userCommunities.filter((community: selectedcommunitytype) => ( community.community_id !== Number(communityObj.id)));
      setUserCommunities(tempUserCommunities);
    } else {
      e.currentTarget.classList.add("selectedcommunity");
      setUserCommunities([ ...userCommunities, { user_id: userId!, community_id: Number(communityObj.id) }]);
    }       
  }

  const handleUpdate: (e: any) => void = (e) => { 
    e.preventDefault();    
    if(userCommunities.length > 3) {
      joincommunity({
        variables: {
          data: [ ...userCommunities]
        }
      });
      updateUser({
        variables: {
          data: usersetup
        } 
      }).then(() => {     
        setError("");
        updateLoggedUser({ new_user: false });
        navigate("/c/popular");
      });
    } else {
      setError("You have to join atleast 4 communities for your home feed.");
    }
  }

  return (
    <div className={ active }>
      <div className="setuserboxoverlay" >
        <div className="setuserbox">
          <div className="newusersetuplogowrapper">
            <img src={ logo } className="newusersetuplogo" alt={"patch_logo"}/>
            { level < 3 && (
              <div className="skipbtn" onClick={() => setLevel(3) }> skip </div>
            )}
          </div>
          { level === 0 ? (
            <>              
              <div className="newuserusernametitle">
                <i className="material-icons blue-text text-lighten-3 left"> mood </i>
                Setting up your profile,
              </div>
              <div className="newuserusernametitle1">Let's start by telling something about you.</div>
              <div className="newuserusername">
                <Askinput 
                  name={ "about" } 
                  placeholder={ "about" } 
                  maxlength={70} 
                  onChange={ handleUserinputs } 
                  value={ usersetup.about }
                />
              </div>
            </>
          ) : level === 1 ? (
            <>
              <h5 className="newuserusernametitle"> Wall pic ... </h5>
              { usersetup?.background_pic.length > 0 && (
                <div className="bgpicdel">
                  <i className="material-icons delicn" onClick={ () => setUsersetup({...usersetup, background_pic: ""})}> delete </i>
                </div>
              )}
              <div className="newuserbackgroundbox">
                { usersetup?.background_pic.length > 0 ? (
                  <div className="newuserbackgroundpic">
                    <img src={ require(`../img/${usersetup.background_pic.substr(12,)}`) } alt="unable to load pic" className="newuserbackgroundpic" />
                  </div>
                ) : (
                  <>
                    <input type="file" 
                      accept="image/*" 
                      id="newuserbgpic"
                      onChange={ handleUserinputs }
                      name="background_pic"                                      
                    />  
                    <label htmlFor="newuserbgpic">
                      <i className="material-icons newuserpicicn"> add </i>
                    </label>
                  </>
                )}
              </div>
            </>
          ) : level === 2 ? (
            <>
              <h6 className="newuserusernametitle"> Profile pic... </h6>
              <div className="newuserprofilepicbox">
                { usersetup?.profile_pic.length > 0 ? (
                  <>
                    <div className="newuserprofilepic">
                      <img src={ require(`../img/${usersetup.profile_pic.substr(12,)}`) } alt="unable to load pic" className="newuserprofilepic" />
                    </div>
                  </>
                ) : (
                  <>
                    <input type="file" 
                      accept="image/*"
                      id="newuserdp" 
                      onChange={ handleUserinputs }
                      name="profile_pic"                                      
                    />  
                    <label htmlFor="newuserdp">
                      <i className="material-icons newuserpicicn"> add </i>
                    </label>
                  </>
                )}
              </div>                           
              { usersetup?.profile_pic.length > 0 && (
                <div className="profilepicdel">
                  <i className="material-icons delicn" onClick={ () => setUsersetup({...usersetup, profile_pic: ""})}> delete </i>
                </div>
              )}
            </>
          ) : level === 3 ? (
            <>  
              <h6 className="newuserusernametitle"> Link Some communities to your home... </h6>
              <div className="metatitle"> (You can add or remove them later) </div>
              { error.length > 1 && (
                <div className="metatitle red-text"> { error } </div>
              )}
              <div className="newusercommunitiesbox">
                { loading === false ? (
                  data?.listCommunities.map((community: communitytype, idx: number) => (
                    <div className="communityspace" key={ idx } onClick={ (e) => handleUpdateCommunities(e, community)}> 
                      { community.communityname }
                    </div>
                  ))
                ) : (
                  <Loadingpage />
                )}
              </div>
            </>
          ) : updateUserLoading === true && (            
            <>
              <div className="newuserusernametitle">             
                Hi,
              </div>
              <div className="newuserusernametitle1">             
                Setting up your profile...
              </div>
            </>
          )}
          { level <= 3 && (
            <div className="setusername">
              <div className="waves-effect waves-light btn blue lighten-1 black-text setusernamebtn" onClick={ level === 3 ? handleUpdate : () => setLevel(level+1) }>
                { level === 3 ? "done" : "next" }
                { level === 3 && (
                  <i className="material-icons right">mood</i>
                )}  
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Newusersetup;
