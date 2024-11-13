import React, { useEffect, useState } from 'react';

//component
import Settingtab from '../../components/settings/Settingtab';
import Socialbox from '../../components/settings/Socialbox';
import Askinput from '../../components/html/Askinput';

//css, image & types
import "./profilesettings.css";
import { profileprops } from './types';
import { PRIVACY } from '../../utils/main/types';
import { defaultUserPic } from '../../constants/const';
import { droppertype, profiletype } from '../../components/html/patdrop/types';
let defaultBackgroundPic: string = require("../../img/defaultbgpic.png");

function Profiletab(profileprops: profileprops) {
  const {
    handleChange,
    profileState,
    setUserData,
    userData,
    handleUserUpdate,
    profileRef,
    wallpicRef,
  } = profileprops;

  //states
  const [showInput, setShowInput] = useState<boolean>(false);
  const [updatedLinks, setUpdatedLinks] = useState<string>("");
  const [showSocialBox, setShowSocialBox] = useState<boolean>(false);

  //handlers 
  const handleUserPrivacy: (val: PRIVACY) => void = (val: PRIVACY) => {
    setUserData({ ...userData, privacy: val });
    handleUserUpdate("privacy", val);
  }

  const profiletypeDropperprofile: profiletype = { set: userData.privacy };
  const profiletypeDroppers: droppertype[] = [
    {
      title: "PUBLIC", icn: "person_outline",
      state: "CLICKED", event: () => handleUserPrivacy("PUBLIC")
    },
    {
      title: "PRIVATE", icn: "lock_outline",
      state: "CLICKED", event: () => handleUserPrivacy("PRIVATE")
    },
  ];

  useEffect(() => {
    if (updatedLinks.length > 0) {
      setUserData({ ...userData, social_links: updatedLinks });
    }
  }, [updatedLinks]);

  return (
    <>
      <div className="usetting">
        <div className="usettingtitle"> Customize profile </div>
        <div className="usettingtitlemeta"> PROFILE INFO </div>
        <div className="usettingitems">
          <div className="waves-effect waves-light picwrapper">
            <img
              className="pic"
              alt="profile_pic"
              src={userData?.profile_pic || defaultUserPic}
            />
          </div>
          <div className="waves-effect waves-light wallpicwrapper">
            <img
              alt="wall_pic"
              className="wallpic"
              src={userData?.background_pic || defaultBackgroundPic}
            />
          </div>
        </div>
        <div className="usettingitems">
          <input
            type="file"
            accept="image/*"
            name="profile_pic"
            id="profileinput"
            ref={profileRef}
            onChange={() => handleUserUpdate("profile_pic")}
          />
          <label htmlFor="profileinput">
            <div className="waves-effect waves-light blue lighten-3 black-text usettingitembtn">
              update
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            id="wallpicinput"
            name="background_pic"
            ref={wallpicRef}
            onChange={() => handleUserUpdate("background_pic")}
          />
          <label htmlFor="wallpicinput">
            <div className="waves-effect waves-light blue lighten-3 black-text usettingitembtn">
              update
            </div>
          </label>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> About </div>
            <div className="usettingitemmetatitle">
              {showInput ? (
                <div className="updateinput">
                  <Askinput
                    name="about"
                    value={userData?.about}
                    placeholder={userData.about || `I m ${userData.username}, A guy with some powers.`}
                    onChange={(e: any) => setUserData({ ...userData, about: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  {userData.about || "A brief description of yourself shown on your profile."}
                </>
              )}
            </div>
          </div>
          <div
            className={`waves-effect waves-light black-text usettingitembtn ${showInput && userData.about.length === 0 ? "red lighten-3" : "blue lighten-3"}`
            }
            onClick={showInput
              ? userData?.about.length === 0
                ? () => setShowInput(false)
                : () => { handleUserUpdate("about"); setShowInput(false) }
              : () => setShowInput(true)}
          >
            {showInput ? userData.about.length === 0 ? "cancel" : "update" : "change"}
          </div>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Social links </div>
            <div className="usettingitemmetatitle">
              People who visit your profile will see social links.
            </div>
          </div>
          <div
            onClick={() => setShowSocialBox(!showSocialBox)}
            className="waves-effect waves-light black-text usettingitembtn"
          >
            {showSocialBox ? "hide" : "Update"}
          </div>
        </div>
        <div className="usettingtitlemeta"> PROFILE CATEGORY </div>
        <Settingtab
          type={"drop"}
          title={"Profile"}
          droppers={profiletypeDroppers}
          dropperProfile={profiletypeDropperprofile}
        />
        <Settingtab
          name={"nsfw"}
          type={"switch"}
          value={profileState.nsfw}
          title={"NSFW (Not Safe For Work)"}
          handleChange={(e: any) => handleChange(e, "profile")}
          metatitle={"This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18)."}
        />
        <div className="usettingtitlemeta"> ADVANCED </div>
        <Settingtab
          type={"switch"}
          name={"allowppltofollow"}
          title={"Allow people to follow you"}
          value={profileState?.allowppltofollow}
          handleChange={(e: any) => handleChange(e, "profile")}
          metatitle={"Followers will be notified about posts you make to your profile and see them in their home feed."}
        />
        <Settingtab
          type={"switch"}
          name={"contentvisiblity"}
          title={"Content Visibility"}
          value={profileState.contentvisiblity}
          handleChange={(e: any) => handleChange(e, "profile")}
          metatitle={"Posts to this profile can appear in c/popular or home feed of users who are following you."}
        />
      </div>
      {showSocialBox && (
        <div className="actionboxes">
          <Socialbox
            setUpdatedLinks={setUpdatedLinks}
            setShowSocialBox={setShowSocialBox}
            socialMediaLinks={userData.social_links}
            handleUpdate={() => handleUserUpdate("social_links")}
          />
        </div>
      )}
    </>
  )
}

export default Profiletab;