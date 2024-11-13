import React from 'react';

//components
import Patdrop from '../../../html/patdrop/Patdrop';

//types
import { chatgrouphandlersprops } from './types';
import { usernametype } from '../../../../utils/main/types';
import { defaultUserPic } from '../../../../constants/const';
import { actiontype, droppertype, profiletype } from '../../../html/patdrop/types';

function Chatgrouphandlers(chatgrouphandlersprops: chatgrouphandlersprops) {
  const { inmates, updateRoomSettings, updateSettings, roomSettings } = chatgrouphandlersprops;

  //handlers
  const handleGroupHandlers = (position: droppertype, inmatename: string) => {
    updateRoomSettings({
      type: "UPDATE",
      payload: {
        ...roomSettings,
        [position.name as string]: inmatename
      }
    });
  };

  const groupSettingPatcherProfile: profiletype = {
    icn: "perm_identity",
    title: "patcher",
  };

  const groupSettingsDropper: droppertype[] = [
    ...(inmates ? inmates.map((inmate: usernametype) => (
      {
        state: "CLICKED" as actiontype,
        title: inmate.username,
        img: inmate.profile_pic || defaultUserPic,
        event: function () { return handleGroupHandlers(this, inmate.username) }
      }
    )) : [])
  ]

  return (
    <>
      <div className="groupsettingoption">
        <div className="groupsettingtitles">
          <div className="groupsettinghandlers">
            <div className="groupsettingtext">admin</div>
            <i className="material-icons groupsettinghandlericn blue-text">memory</i>
          </div>
          <div className="groupsettingmetatitle">superuser</div>
        </div>
        <div className="groupsettingmedia">
          <Patdrop
            name={"admin"}
            droppers={groupSettingsDropper}
            profile={groupSettingPatcherProfile}
          />
        </div>
      </div>
      <div className="groupsettingoption">
        <div className="groupsettingtitles">
          <div className="groupsettinghandlers">
            <div className="groupsettingtext">co admin</div>
            <i className="material-icons groupsettinghandlericn blue-text">mic_none</i>
          </div>
          <div className="groupsettingmetatitle">admin right hand</div>
        </div>
        <div className="groupsettingmedia">
          <Patdrop
            name={"co_admin"}
            droppers={groupSettingsDropper}
            profile={groupSettingPatcherProfile}
          />
        </div>
      </div>
      {inmates!?.length > 4 && (
        <>
          <div className="groupsettingoption">
            <div className="groupsettingtitles">
              <div className="groupsettinghandlers">
                <div className="groupsettingtext">operator</div>
                <i className="material-icons groupsettinghandlericn blue-text">smoking_rooms</i>
              </div>
              <div className="groupsettingmetatitle">accept, delete request</div>
            </div>
            <div className="groupsettingmedia">
              <Patdrop
                name={"operator"}
                droppers={groupSettingsDropper}
                profile={groupSettingPatcherProfile}
              />
            </div>
          </div>
          <div className="groupsettingoption">
            <div className="groupsettingtitles">
              <div className="groupsettinghandlers">
                <div className="groupsettingtext">acceptor</div>
                <i className="material-icons groupsettinghandlericn blue-text">smoke_free</i>
              </div>
              <div className="groupsettingmetatitle">accept request</div>
            </div>
            <div className="groupsettingmedia">
              <Patdrop
                name={"acceptor"}
                droppers={groupSettingsDropper}
                profile={groupSettingPatcherProfile}
              />
            </div>
          </div>
        </>
      )}
      <div className="groupsettingoption">
        <div className="groupsettingbtn waves-effect waves-light blue-text" onClick={() => updateSettings()}>
          update
        </div>
      </div>
    </>
  );
}

export default Chatgrouphandlers;