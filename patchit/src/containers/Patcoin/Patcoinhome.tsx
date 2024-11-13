import React from 'react';

//components
import Actions from './Actions';

//css, images & types
import "./patcoinwallet.css";
import { patcoinhomepropstype } from './types';
const patcoin_img = require("../../img/loading_logo.png");

function Patcoinhome(patcoinhomeprops: patcoinhomepropstype) {
  const { activeState, setActiveState, handleWalletMode } = patcoinhomeprops;

  return (
    <>
      <div className="wallethead blue-text lighten-1">
        Patcoin
      </div>
      <div className="walletbody">
        <div className="patcoinimgwrapper">
          <img
            src={patcoin_img}
            alt="patcoin_pic"
            className="patcoinimg"
          />
        </div>
        <div className="walletbalance">
          1 patcoin
        </div>
        <div className="walletactions">
          <Actions
            activeState={activeState}
            setActiveState={setActiveState}
            handleWalletMode={handleWalletMode}
          />
        </div>
      </div>
      <div className="walletfooter">
        <div className="address blue-text text-lighten-3">
          Wallet ID:
        </div>
        XXXXXXXXXXXXXXXXXXXXXXXX0
      </div>
    </>
  )
}

export default Patcoinhome;