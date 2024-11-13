import React, { useRef } from 'react';

import { changeToBase64 } from '../../../../utils/opx';

//components
import Askinput from '../../../html/Askinput';
import Patdrop from '../../../html/patdrop/Patdrop';

//css, types & constants
import "../../css/chatroomsettings.css";
import { chatgroupadminprops } from './types';
import { allowedmediatype } from '../../types';
import { defaultCommunityPic } from '../../../../constants/const';
import { droppertype, profiletype } from '../../../html/patdrop/types';

function Chatgroupadmin(chatgroupadminprops: chatgroupadminprops) {
  const { roomSettings, updateRoomSettings, updateSettings } = chatgroupadminprops;
  const roomProfileRef = useRef<HTMLInputElement | null>(null);

  //handlers
  const handleGroupMedia: (mediaSetting: allowedmediatype) => void = (mediaSetting: allowedmediatype) => {
    updateRoomSettings({
      type: "UPDATE",
      payload: { ...roomSettings, allowedMedia: mediaSetting }
    });
  };

  const media = roomSettings?.allowedMedia === "ALL"
    ? "videos & images"
    : roomSettings?.allowedMedia === "IMAGES"
      ? "images"
      : roomSettings?.allowedMedia === "VIDEOS"
        ? "videos"
        : "videos & images";

  const roomSettingsDropperprofile: profiletype = { set: media };

  const handleUpdatePic: () => Promise<void> = async () => {
    if (roomProfileRef?.current && roomProfileRef?.current?.files) {
      const picBlob = roomProfileRef?.current?.files[0];
      const pic = await changeToBase64(picBlob);
      if (pic) {
        updateRoomSettings({ type: "UPDATE", payload: { ...roomSettings, profile_pic: pic } })
      }
    }
  }

  const roomSettingsDropper: droppertype[] = [
    { title: "videos & images", icn: "collections", state: "CLICKED", event: () => handleGroupMedia("ALL") },
    { title: "images", icn: "broken_image", state: "CLICKED", event: () => handleGroupMedia("IMAGES") },
    { title: "videos", icn: "library_music", state: "CLICKED", event: () => handleGroupMedia("VIDEOS") },
  ];

  const handleSettings: (e: any) => void = (e: any) => {
    updateRoomSettings({
      type: "UPDATE",
      payload: { ...roomSettings, [e.target.name]: e.target.value }
    });
  }

  return (
    <>
      <div className="groupsettingoption">
        <div className="groupsettingtext"> profile pic </div>
        <div className="groupprofilepicwrapper">
          <input
            type="file"
            accept="image/*"
            name="profile_pic"
            id="room_profile"
            ref={roomProfileRef}
            onChange={handleUpdatePic}
          />
          <label htmlFor="room_profile">
            <div className="roomprofile"></div>
          </label>
          <img
            alt="group_dp"
            className="groupprofilepic"
            src={roomSettings?.profile_pic || defaultCommunityPic}
          />
        </div>
      </div>
      <div className="groupsettinginput">
        <div className="groupsettingtext"> about </div>
        <div className="aboutgroupinput">
          <Askinput
            maxlength={100}
            name={"about"}
            value={roomSettings.about}
            onChange={(e) => handleSettings(e)}
            placeholder={"Tell us something about room..."}
          />
        </div>
      </div>
      <div className="groupsettingoption">
        <div className="groupsettingtext">
          allowed media
        </div>
        <div className="groupsettingmedia">
          <Patdrop
            droppers={roomSettingsDropper}
            profile={roomSettingsDropperprofile}
          />
        </div>
      </div>
      <div className="groupsettingoption">
        <div className="groupsettingtext"> theme </div>
        <div className="colorpicker">
          <input
            type="color"
            name="theme"
            value={roomSettings.theme}
            className="groupsettingcolorpicker"
            onChange={(e: any) => handleSettings(e)}
          />
        </div>
      </div>
      <div className="groupsettingoption">
        <div className="groupsettingtext">
          Delete Room
        </div>
        <div
          className="groupsettingbtn waves-effect waves-light red-text text-lighten-1"
        >
          delete
        </div>
      </div>
      <div className="groupsettingoption">
        <div
          onClick={() => updateSettings()}
          className="groupsettingbtn waves-effect waves-light blue-text text-lighten-1"
        >
          Update
        </div>
      </div>
    </>
  )
}

export default Chatgroupadmin;