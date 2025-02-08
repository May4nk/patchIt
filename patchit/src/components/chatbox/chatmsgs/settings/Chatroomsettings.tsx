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
import { chatboxstatetype, chatroomsettingprops, roomsettingtab, updatechatroompreferencestype } from '../../types';

function Chatroomsettings(chatroomsettingprops: chatroomsettingprops) {
  const { userId, usersList, chatroomPreferences, handleChatBoxState } = chatroomsettingprops;

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
            room: chatroomPreferences?.name,
            chatgrouptheme: chatroomPreferences?.theme,
            allowedmedia: chatroomPreferences?.allowedMedia || "ALL",
            group_profile: chatroomPreferences?.profile_pic,
            blocked: chatroomPreferences?.blockedUsers.length > 0 ? JSON.stringify(chatroomPreferences?.blockedUsers) : "",
          }
        },
        onCompleted: () => {
          handleChatBoxState({
            type: "SET_ERROR",
            error: {
              show: true, status: 200, message: "Settings updated successfully"
            }
          });

          return;
        },
      });
    } catch (err) {
      handleChatBoxState({
        type: "SET_ERROR",
        error: {
          show: true, status: 500, message: "Something went wrong while updating settings."
        }
      });
      return;
    }
  }

  const updateChatroomPreferences: updatechatroompreferencestype = (settings: Partial<chatboxstatetype["roomInfo"]>) => {
    handleChatBoxState({ type: "SET_ACTIVE_ROOMINFO", info: settings });
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
            inmates={chatroomPreferences?.users}
            updateRoomSettings={updateChatroomPreferences}
          />
        )}
      </div>
    </div>
  )
}

export default Chatroomsettings;