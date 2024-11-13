import React, { useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';

import { changeToBase64 } from "../utils/opx";
import { useAuth, useLogged } from "../utils/hooks/useAuth";

//components
import Askinput from "../components/html/Askinput";
import Loadingpage from "../components/Loadingpage";

//queries
import { UPDATEUSER } from "../utils/loginqueries";
import { GETPOPULARCOMMUNITIES, JOINCOMMUNITYINBATCH } from "./queries/newusersetup";

//css, images & types
import "./css/newusersetup.css";
import { authcontexttype } from "../context/types";
import { newusersetuptype, newusersetupprops, selectedcommunitytype, communitytype } from "./types/newusersetuptypes";
const logo: string = require("../img/logo.png");

const Newusersetup = (newusersetupprops: newusersetupprops) => {
  const { newUser } = newusersetupprops;
  const active: string = newUser ? "block" : "none";

  const navigate = useNavigate();
  const profileRef = useRef<HTMLInputElement | null>(null);
  const wallpicRef = useRef<HTMLInputElement | null>(null);

  const { updateLoggedUser } = useLogged();
  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

  //states 
  const [level, setLevel] = useState<number>(0);
  const [userCommunities, setUserCommunities] = useState<selectedcommunitytype[]>([]);
  const [userSetup, setUserSetup] = useState<newusersetuptype>({
    id: userId!,
    about: "",
    profile_pic: "",
    new_user: false,
    background_pic: "",
  });

  //queries
  const { loading, data } = useQuery(GETPOPULARCOMMUNITIES);
  const [joincommunity] = useMutation(JOINCOMMUNITYINBATCH);
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATEUSER);

  //handlers
  const handleUserinputs: (e: any) => Promise<void> = async (e: any) => {
    const toUpdate: string = e.target.name;

    if (toUpdate === "profile_pic" || toUpdate === "background_pic") {
      const profileFiles = profileRef.current?.files;
      const wallpicFiles = wallpicRef.current?.files;

      const picBlob = (profileFiles && profileFiles.length > 0 ? profileFiles[0] : null) ||
        (wallpicFiles && wallpicFiles.length > 0 ? wallpicFiles[0] : null);

      if (picBlob) {
        const pic = await changeToBase64(picBlob);
        setUserSetup((prev) => ({ ...prev, [toUpdate]: pic }));
      }
    } else {
      setUserSetup((prev) => ({ ...prev, [toUpdate]: e.target.value }));
    }
  }

  const handleDefault: () => void = () => {
    setLevel(0);
    setUserCommunities([]);
    setUserSetup({
      id: userId!,
      about: "",
      profile_pic: "",
      new_user: false,
      background_pic: "",
    });
  }

  const handleUpdateCommunities: (e: any, communityObj: communitytype) => void = (e, communityObj) => {
    const classExistInElement = e.currentTarget.classList.contains("selectedcommunity");

    if (classExistInElement) {
      e.currentTarget.classList.remove("selectedcommunity");

      const tempUserCommunities: selectedcommunitytype[] = userCommunities.filter((community: selectedcommunitytype) => {
        return community.community_id !== Number(communityObj.id);
      })

      setUserCommunities(tempUserCommunities);
    } else {
      e.currentTarget.classList.add("selectedcommunity");

      setUserCommunities([...userCommunities, { user_id: userId!, community_id: Number(communityObj.id) }]);
    }
  }

  const handleUpdate: (e: any) => Promise<void> = async (e: any) => {
    e.preventDefault();
    try {
      if (userCommunities.length > 0) {
        await joincommunity({
          variables: {
            data: [...userCommunities]
          }
        });
      }

      await updateUser({
        variables: {
          data: userSetup
        }
      }).then(() => {
        updateLoggedUser({
          new_user: false,
          profile_pic: userSetup.profile_pic,
        });

        handleDefault();
        navigate("/c/popular");
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={active}>
      <div className="setuserboxoverlay" >
        <div className="setuserbox">
          <div className="newusersetuplogowrapper">
            <img src={logo} className="newusersetuplogo" alt={"patch_logo"} />
            {level < 3 && (
              <div className="skipbtn" onClick={() => setLevel(3)}> skip </div>
            )}
          </div>
          {level === 0 ? (
            <>
              <div className="newuserusernametitle">
                <i className="material-icons blue-text text-lighten-3 left"> mood </i>
                Setting up your profile,
              </div>
              <div className="newuserusernametitle1">
                Let's start by telling something about you.
              </div>
              <div className="newuserusername">
                <Askinput
                  name={"about"}
                  placeholder={"about"}
                  maxlength={70}
                  onChange={handleUserinputs}
                  value={userSetup.about}
                />
              </div>
            </>
          ) : level === 1 ? (
            <>
              <h5 className="newuserusernametitle">Your wall</h5>
              {userSetup?.background_pic.length > 0 && (
                <div className="bgpicdel">
                  <i
                    className="material-icons delicn"
                    onClick={() => setUserSetup({ ...userSetup, background_pic: "" })}
                  >
                    delete
                  </i>
                </div>
              )}
              <div className="newuserbackgroundbox">
                {userSetup?.background_pic.length > 0 ? (
                  <div className="newuserpicwrapper">
                    <img
                      alt="unable to load pic"
                      className="newuserpic"
                      src={userSetup.background_pic}
                    />
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={wallpicRef}
                      id="newuserbgpic"
                      name="background_pic"
                      onChange={handleUserinputs}
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
              <h6 className="newuserusernametitle"> Profile pic </h6>
              {userSetup?.profile_pic.length > 0 && (
                <div className="bgpicdel">
                  <i
                    className="material-icons delicn"
                    onClick={() => setUserSetup({ ...userSetup, profile_pic: "" })}
                  >
                    delete
                  </i>
                </div>
              )}
              <div className="newuserprofilepicbox">
                {userSetup?.profile_pic.length > 0 ? (
                  <>
                    <div className="newuserpicwrapper">
                      <img
                        alt="unable to load pic"
                        className="newuserpic"
                        src={userSetup.profile_pic}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      id="newuserdp"
                      accept="image/*"
                      ref={profileRef}
                      name="profile_pic"
                      onChange={handleUserinputs}
                    />
                    <label htmlFor="newuserdp">
                      <i className="material-icons newuserpicicn"> add </i>
                    </label>
                  </>
                )}
              </div>
            </>
          ) : level === 3 ? (
            <>
              <h6 className="newuserusernametitle"> Link Some communities to your home... </h6>
              <div className="metatitle"> (You can add or remove them later) </div>
              <div className="newusercommunitiesbox">
                {!loading ? (
                  data?.listCommunities.map((community: communitytype, idx: number) => (
                    <div
                      key={idx}
                      className="communityspace"
                      onClick={(e) => handleUpdateCommunities(e, community)}
                    >
                      {community.communityname}
                    </div>
                  ))
                ) : (
                  <Loadingpage />
                )}
              </div>
            </>
          ) : updateUserLoading && (
            <>
              <div className="newuserusernametitle">
                Hi,
              </div>
              <div className="newuserusernametitle1">
                Setting up your profile...
              </div>
            </>
          )}
          {level <= 3 && (
            <div className="setusername">
              <div
                onClick={level === 3 ? handleUpdate : () => setLevel(level + 1)}
                className="waves-effect waves-light setusernamebtn"
              >
                {level === 3 ? "done" : "next"}
                {level === 3 && (
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
