import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

//components
import Chatgroupadmin from './Chatgroupadmin';
import Chatgroupblocked from './Chatgroupblocked';
import Chatgrouphandlers from './Chatgrouphandlers';
import Chatgrouprequests from './Chatgrouprequests';

//queries
import { UPSERTCHATROOMPREFERENCE } from '../../queries';

//css, constants & types
import "../../css/chatroomsettings.css";
import { roomsettingtabs } from '../../../../constants/const';
import { chatroomsettingprops, roomsettingtab } from '../../types';

function Chatroomsettings(chatroomsettingprops: chatroomsettingprops) {
  const { userId, usersList, chatroomPreferences, updateChatroomPreferences, setError } = chatroomsettingprops;

  //states
  const [roomSettingTab, setRoomSettingTab] = useState<roomsettingtab>("admin");

  //queries
  const [upsertRoomSettings] = useMutation(UPSERTCHATROOMPREFERENCE);

  //handlers
  const updateSettings: () => Promise<void> = async () => {
    try {
      await upsertRoomSettings({
        variables: {
          data: {
            about: chatroomPreferences?.about,
            owner: chatroomPreferences?.ownerId,
            room: chatroomPreferences?.roomName,
            chatgrouptheme: chatroomPreferences?.theme,
            allowedmedia: chatroomPreferences?.allowedMedia || "ALL",
            group_profile: chatroomPreferences?.profile_pic,
            blocked: chatroomPreferences?.blocked.length > 0 ? JSON.stringify(chatroomPreferences?.blocked) : "",
          }
        },
        onCompleted: () => {
          setError({ show: true, status: 200, message: "Settings updated successfully" });
        },
      });
    } catch (err) {
      setError({ show: true, status: 500, message: "Something went wrong while updating settings." });
    }
  }

  const activeGroupSetting: (uoption: roomsettingtab) => void = (uoption: roomsettingtab) => {
    document.querySelector(`.chat${roomSettingTab}`)?.classList?.remove("selectedtab");
    setRoomSettingTab(uoption);
    document.querySelector(`.chat${uoption}`)?.classList?.add("selectedtab");
  }

  useEffect(() => {
    activeGroupSetting("admin");
  }, []);

  return (
    <div className="chatgroupsettingwrapper">
      <div className="groupsettingtabs">
        {roomsettingtabs.map((tab: roomsettingtab, idx: number) => (
          <div
            key={idx}
            onClick={() => activeGroupSetting(tab)}
            className={`chat${tab} groupchooser waves-effect waves-light`}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="groupsettingbody">
        {roomSettingTab === "admin" ? (
          <Chatgroupadmin
            updateSettings={updateSettings}
            roomSettings={chatroomPreferences}
            updateRoomSettings={updateChatroomPreferences}
          />
        ) : (roomSettingTab === "blocked") ? (
          <Chatgroupblocked
            userId={userId!}
            updateSettings={updateSettings}
            roomSettings={chatroomPreferences}
            inmates={chatroomPreferences?.users}
            updateRoomSettings={updateChatroomPreferences}
          />
        ) : (roomSettingTab === "requests") ? (
          <Chatgrouprequests
            newinmates={usersList}
            inmates={chatroomPreferences?.users}
          />
        ) : (roomSettingTab === "handlers") && (
          <Chatgrouphandlers
            updateSettings={updateSettings}
            roomSettings={chatroomPreferences}
            inmates={chatroomPreferences?.users}
            updateRoomSettings={updateChatroomPreferences}
          />
        )}
      </div>
    </div>
  )
}

export default Chatroomsettings;