import React, { useState } from 'react';

//components
import Askinput from '../../../html/Askinput';

//types
import { chatgroupusertype } from '../../types';
import { chatgrouprequestsprops } from './types';
import { usernametype } from '../../../../utils/main/types';

function Chatgrouprequests(Chatgrouprequestsprops: chatgrouprequestsprops) {
  const { newinmates, inmates } = Chatgrouprequestsprops;

  //states
  const [searchInmate, setSearchInmate] = useState<string>("");
  const [selectedInmates, setSelectedInmates] = useState<string[]>([]);

  //handlers
  const searchUsers = newinmates?.filter((user: chatgroupusertype) => {
    return user.username.includes(searchInmate);
  });

  const filteredUsers = searchUsers.filter((user: chatgroupusertype) => {
    return !inmates!.map((inmate: usernametype) => inmate.username).includes(user.username);
  });

  const handleSelectedInmates: (
    username: string,
    unselect: boolean
  ) => void = (username: string, unselect: boolean = false) => {
    if (unselect) {
      setSelectedInmates(
        selectedInmates?.filter((name: string) => name !== username)
      )
    } else {
      setSelectedInmates([...selectedInmates, username])
    }
  }

  return (
    <div className="chatgrouprequestswrapper">
      <div className="chatgrouprequestinput">
        <Askinput
          name={"searchInmates"}
          placeholder={"search new inmates"}
          value={searchInmate}
          onChange={(e) => setSearchInmate(e.target.value)}
        />
      </div>
      {selectedInmates.length > 0 && (
        <>
          <div className="groupsettingtitle"> new inmates </div>
          <div className="selectedinmates">
            {selectedInmates.map((inmateUsername: string, idx: number) => (
              <div
                key={idx}
                className="groupchooser waves-effect waves-light"
                onClick={() => handleSelectedInmates(inmateUsername, true)}
              >
                {inmateUsername}
              </div>
            ))}
          </div>

        </>
      )}
      {searchInmate.length > 0 && (
        <>
          <div className="groupsettingtitle"> found users </div>
          <div className="foundinmates">
            {filteredUsers?.filter((inmate: chatgroupusertype) => (
              !selectedInmates?.includes(inmate.username)
            )).map((inmate: chatgroupusertype, idx: number) => (
              <div
                key={idx}
                className="groupchooser waves-effect waves-light"
                onClick={() => handleSelectedInmates(inmate.username, false)}
              >
                {inmate.username}
              </div>
            ))}
          </div>
        </>
      )}
      {selectedInmates.length > 0 && (
        <div className="groupsettingoption">
          <div className="groupsettingbtn waves-effect waves-light blue-text">
            send
            <i className="material-icons groupsettingbtnicn">notifications_active</i>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatgrouprequests;