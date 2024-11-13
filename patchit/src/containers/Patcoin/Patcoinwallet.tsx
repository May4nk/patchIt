import React, { useState } from 'react';

//components
import Add from './Add';
import Earn from './Earn';
import Send from './Send';
import Stats from './Stats';
import History from './History';
import Patcoinhome from './Patcoinhome';

//css, images & types
import "./patcoinwallet.css";
import { handlewalletmodetype, walletmodetype, walletstatetype } from './types';

function Patcoinwallet() {

  //states
  const [walletMode, setWalletMode] = useState<walletmodetype>("home");
  const [activeState, setActiveState] = useState<walletstatetype>("history");

  //handlers
  const handleWalletMode: handlewalletmodetype = (mode: walletmodetype) => {
    const activeMode = document.getElementById("patcoincard");
    if (activeMode) {
      if (mode === "send") {
        activeMode.classList.remove("turned");
        activeMode.classList.add("flipped");
      } else if (mode === "add") {
        activeMode.classList.remove("flipped");
        activeMode.classList.add("turned");
      } else if (mode === "home") {
        activeMode.classList.remove("turned");
        activeMode.classList.remove("flipped");
      }

      setTimeout(() => { setWalletMode(mode); }, 275);

    }
  }

  return (
    <div className="patcoinwallet">
      <div className="patcoincard" id="patcoincard">
        {walletMode === "home" ? (
          <div className="patcoinhome">
            <Patcoinhome
              activeState={activeState}
              setActiveState={setActiveState}
              handleWalletMode={handleWalletMode}
            />
          </div>
        ) : walletMode === "send" ? (
          <div className="patcoinsend">
            <Send
              handleWalletMode={handleWalletMode}
            />
          </div>
        ) : walletMode === "add" && (
          <div className="patcoinadd">
            <Add
              handleWalletMode={handleWalletMode}
            />
          </div>
        )}
      </div>
      <div className="patcointransx">
        {activeState === "history" ? (
          <History />
        ) : activeState === "stats" ? (
          <Stats />
        ) : activeState === "earn" && (
          <Earn />
        )}
      </div>
    </div>
  );
}

export default Patcoinwallet;