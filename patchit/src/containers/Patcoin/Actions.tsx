import React, { useEffect } from 'react';

//css & types
import "./patcoinwallet.css";
import { actionpropstype, walletstatetype } from './types';

function Actions(actionprops: actionpropstype) {
  const { activeState, setActiveState, handleWalletMode } = actionprops;

  //handlers
  const handleActiveState: (state: walletstatetype) => void = (state: walletstatetype) => {
    const currentActiveState = document.getElementById(activeState);
    if (currentActiveState) {
      currentActiveState.style.color = "rgba(255, 255, 255, 0.3)";
    }

    const newActiveState = document.getElementById(state);
    setActiveState(state);
    if (newActiveState) {
      newActiveState.style.color = "white";
    }
  }

  useEffect(() => {
    handleActiveState("history");
  }, [])

  return (
    <>
      <div className="walletaction" onClick={() => handleWalletMode("send")}>
        <i className="material-icons walleticn blue-text text-lighten-2"> near_me </i>
        send
      </div>
      <div className="walletaction" onClick={() => handleWalletMode("add")}>
        <i className="material-icons walleticn blue-text text-lighten-2"> add </i>
        add
      </div>
      <div className="walletaction" id="history" onClick={() => handleActiveState("history")}>
        <i className="material-icons walleticn grey-text text-lighten-2"> event_note </i>
        history
      </div>
      <div className="walletaction" id="stats" onClick={() => handleActiveState("stats")}>
        <i className="material-icons walleticn grey-text text-lighten-2"> timeline </i>
        stats
      </div>
      <div className="walletaction" id="earn" onClick={() => handleActiveState("earn")}>
        <i className="material-icons walleticn yellow-text text-lighten-2"> lightbulb_outline </i>
        earn
      </div>
    </>
  )
}

export default Actions;