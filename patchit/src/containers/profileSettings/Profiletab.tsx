import React from 'react';
//css & types
import "./profilesettings.css";
import { profilestatetype, userdatatype, modalstatetype } from './profilesettingtypes';
let pic: string = require("../../img/a.jpg");
interface profileprops {
  handleChange: (e: any, statename: string) => void;
  profileState: profilestatetype;
  userData: userdatatype;
  handleModalState: (mstate: modalstatetype) => void;
}

function Profiletab(profileprops: profileprops) {
  const { handleChange, profileState, userData, handleModalState } = profileprops;
  return (
    <div className="usetting">
      <div className="usettingtitle"> Customize profile </div>
      <div className="usettingtitlemeta"> PROFILE INFO </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Background Pic </div>
          <div className="usettingitemmetatitle"> Your Profile wall pic. </div>
        </div>
        <div className="waves-effect waves-light wallpicwrapper">
          <img className="wallpic" src={pic} alt="wall_pic" />
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Profile Pic </div>
        </div>
        <div className="waves-effect waves-light picwrapper">
          <img className="pic" src={pic} alt="profile_pic" />
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> About </div>
          <div className="usettingitemmetatitle">
            {userData.about || "A brief description of yourself shown on your profile."}
          </div>
        </div>
        <div className="waves-effect waves-light black-text blue usettingitembtn"
          onClick={() => {
            handleModalState({
              txt: "Tell us about yourself.",
              btntxt: "update",
              placeholder: "About",
              toUpdate: "about"
            })
          }}
        >
          Update
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Social links </div>
          <div className="usettingitemmetatitle">
            People who visit your profile will see your social links.
          </div>
        </div>
        <div className="waves-effect waves-light black-text blue usettingitembtn">
          Update
        </div>
      </div>
      <div className="usettingtitlemeta"> PROFILE CATEGORY </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> NSFW (Not Safe For Work)</div>
          <div className="usettingitemmetatitle">
            This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18).
          </div>
        </div>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="nsfw"
              checked={profileState.nsfw}
              onChange={(e: any) => handleChange(e, "profile")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingtitlemeta"> ADVANCED </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Allow people to follow you </div>
          <div className="usettingitemmetatitle">
            Followers will be notified about posts you make to your profile and see them in their home feed.
          </div>
        </div>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="allowppltofollow"
              checked={profileState.allowppltofollow}
              onChange={(e: any) => handleChange(e, "profile")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Content Visibility </div>
          <div className="usettingitemmetatitle">
            Posts to this profile can appear in c/popular or home feed of users who are following you.
          </div>
        </div>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              className="blue-text"
              name="contentvisiblity"
              checked={profileState.contentvisiblity}
              onChange={(e: any) => handleChange(e, "profile")}
            />
            <span className="lever"></span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Profiletab;