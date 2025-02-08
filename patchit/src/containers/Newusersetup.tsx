import React, { useReducer, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';

//utils
import { useAuth, useLogged } from "../utils/hooks/useAuth";
import { getSignedUrls, uploadToS3 } from "../utils/services/s3";
import { handleNewUserState, newUserSetupInitState } from "../utils/opx/useropx";

//components
import Askinput from "../components/html/Askinput";
import Loadingpage from "../components/Loadingpage";
import Errorcard from "../components/cards/Errorcard";

//queries
import { UPDATEUSER } from "../utils/loginqueries";
import { GETPOPULARCOMMUNITIES, JOINCOMMUNITYINBATCH } from "./queries/newusersetup";

//css, images & types
import "./css/newusersetup.css";
import { signedurltype } from "../utils/types";
import { authcontexttype } from "../context/types";
import { USER_S_N_TYPE } from "../utils/main/types";
import { communitytype, handledelpictype, newusersetuplevel, newuserstatetype } from "./types/newusersetuptypes";
const logo: string = require("../img/logo.png");

const Newusersetup = ({ newUser }: { newUser: boolean }) => {
  const active: string = newUser ? "block" : "none";

  const navigate = useNavigate();
  const { updateLoggedUser } = useLogged();
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const profileRef = useRef<HTMLInputElement | null>(null);
  const wallpicRef = useRef<HTMLInputElement | null>(null);

  //states
  const [newUserState, dispatch] = useReducer(handleNewUserState, newUserSetupInitState);

  //queries
  const { loading, data } = useQuery(GETPOPULARCOMMUNITIES);
  const [joincommunity] = useMutation(JOINCOMMUNITYINBATCH);
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATEUSER);

  //handlers
  const handleUserinputs: (e: any) => Promise<void> = async (e: any) => {
    const toUpdate: keyof newuserstatetype["userInfo"] = e.target.name;

    if (toUpdate === "profile_pic" || toUpdate === "background_pic") {
      const profileFiles = profileRef.current?.files;
      const wallpicFiles = wallpicRef.current?.files;

      const picBlob: File | null = (profileFiles && profileFiles.length > 0 ? profileFiles[0] : null) ||
        (wallpicFiles && wallpicFiles.length > 0 ? wallpicFiles[0] : null);

      if (picBlob) {
        const fileName = `${toUpdate}.${picBlob.type.split('/')[1]}`;
        const newPic = new File([picBlob], fileName);

        const uploadUrls: signedurltype[] = await getSignedUrls({
          userId: userId!,
          postId: "0",
          req: "PUT",
          files: [{
            name: newPic.name,
            type: newPic.type,
          }],
        });

        await uploadToS3({
          url: uploadUrls[0].signedUrl,
          file: newPic,
          progress: (progress) => { }
        });

        dispatch({ type: "UPDATE_USERINFO", info: { [toUpdate]: uploadUrls[0].fileUrl } });

        const signedUrls: signedurltype[] = await getSignedUrls({
          userId: userId!,
          postId: "0",
          req: "GET",
          files: [{ name: uploadUrls[0].fileUrl }]
        });


        if (toUpdate === "profile_pic") {
          dispatch({ type: "UPDATE_PIC", profile_pic: signedUrls[0].signedUrl })
        }

        if (toUpdate === "background_pic") {
          dispatch({ type: "UPDATE_BG_PIC", background_pic: signedUrls[0].signedUrl })
        }
      }
    } else {
      dispatch({ type: "UPDATE_USERINFO", info: { [toUpdate]: e.target.value } });
    }
  }

  const handleUpdateCommunities: (e: any, communityObj: communitytype) => void = (e, communityObj) => {
    const classExistInElement = e.currentTarget.classList.contains("selectedcommunity");

    if (classExistInElement) {
      e.currentTarget.classList.remove("selectedcommunity");
      dispatch({ type: "DEL_USERCOMMUNITY", communityId: communityObj.id });
    } else {
      e.currentTarget.classList.add("selectedcommunity");
      dispatch({ type: "ADD_USERCOMMUNITY", community: { user_id: userId!, community_id: communityObj.id } })
    }
  }

  const handleDelPic: handledelpictype = (toUpdate: "profile_pic" | "background_pic") => {
    if (toUpdate === "profile_pic") {
      dispatch({ type: "UPDATE_PIC", profile_pic: null });
    } else {
      dispatch({ type: "UPDATE_BG_PIC", background_pic: null });
    }

    dispatch({ type: "UPDATE_USERINFO", info: { [toUpdate]: null } });
  }

  const handleUpdate: (e: any) => Promise<void> = async (e: any) => {
    e.preventDefault();
    try {
      if (newUserState?.userCommunities.length > 0) {
        await joincommunity({
          variables: {
            data: [...newUserState?.userCommunities]
          }
        });
      }

      await updateUser({
        variables: {
          data: {
            id: userId!,
            ...newUserState?.userInfo
          }
        }
      }).then(() => {
        updateLoggedUser({
          profile_pic: newUserState.display_profile_pic
        });

        dispatch({ type: "RESET" });
        navigate("/c/popular");
      });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: {
          status: 500,
          show: true,
          message: "Something went wrong: setup failed..."
        }
      });
      return;
    }
  }

  return (
    <div className={active}>
      <div className="setuserboxoverlay" >
        <div className="setuserbox">
          <div className="newusersetuplogowrapper">
            <img src={logo} className="newusersetuplogo" alt={"patch_logo"} />
            {newUserState?.level < 3 && (
              <div className="skipbtn" onClick={() => dispatch({ type: "SET_LEVEL", level: 3 })}>
                skip
              </div>
            )}
          </div>
          {newUserState?.level === 0 ? (
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
                  value={newUserState?.userInfo.about}
                />
              </div>
            </>
          ) : newUserState?.level === 1 ? (
            <>
              <h5 className="newuserusernametitle">Your wall</h5>
              {newUserState?.userInfo?.background_pic && (
                <div className="bgpicdel">
                  <i
                    className="material-icons delicn"
                    onClick={() => handleDelPic("background_pic")}
                  >
                    delete
                  </i>
                </div>
              )}
              <div className="newuserbackgroundbox">
                {newUserState?.display_background_pic ? (
                  <div className="newuserpicwrapper">
                    <img
                      alt="unable to load pic"
                      className="newuserpic"
                      src={newUserState?.display_background_pic}
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
          ) : newUserState?.level === 2 ? (
            <>
              <h6 className="newuserusernametitle"> Profile pic </h6>
              {newUserState?.display_profile_pic && (
                <div className="bgpicdel">
                  <i
                    className="material-icons delicn"
                    onClick={() => handleDelPic("profile_pic")}
                  >
                    delete
                  </i>
                </div>
              )}
              <div className="newuserprofilepicbox">
                {newUserState?.display_profile_pic ? (
                  <>
                    <div className="newuserpicwrapper">
                      <img
                        alt="unable to load pic"
                        className="newuserpic"
                        src={newUserState.display_profile_pic}
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
          ) : newUserState?.level === 3 ? (
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
                      {community.name}
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
          {newUserState?.level <= 3 && (
            <div className="setusername">
              <div
                className="waves-effect waves-light setusernamebtn"
                onClick={newUserState?.level === 3
                  ? handleUpdate
                  : () => dispatch({ type: "SET_LEVEL", level: (newUserState.level + 1 as newusersetuplevel) })
                }
              >
                {newUserState?.level === 3 ? "done" : "next"}
                {newUserState?.level === 3 && (
                  <i className="material-icons right">mood</i>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {newUserState.error.status === 500 && (
        <Errorcard message={newUserState.error} />
      )}
    </div>
  )
}

export default Newusersetup;
