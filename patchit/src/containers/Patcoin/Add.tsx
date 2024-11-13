import React, { useState } from 'react';

//components
import Askinput from '../../components/html/Askinput';

//types & css
import "./patcoinwallet.css";
import { addpatctointype, patcoinaddpropstype } from './types';

function Add(patcoinaddprops: patcoinaddpropstype) {
  const { handleWalletMode } = patcoinaddprops;

  //states
  const [addPatcoin, setAddPatcoin] = useState<addpatctointype>({
    amnt: 0,
  });

  return (
    <>
      <div className="wallethead blue-text text-lighten-3">
        Add
        <div className="walletheadactions">
          <i
            className="material-icons walletheadicn"
            onClick={() => handleWalletMode("home")}
          >
            home
          </i>
          <i
            className="material-icons walletheadicn"
            onClick={() => handleWalletMode("send")}
          >
            near_me
          </i>
          <div className="patcoinbalance">
            Patcoins: 1
          </div>
        </div>
      </div>
      <div className="walletbody">
        <div className="sendpatcoin">
          <div className="walletinput">
            <Askinput
              name={"amnt"}
              placeholder={"amount"}
              type={"number"}
              onChange={(e) => setAddPatcoin({ ...addPatcoin, amnt: Number(e.target.value) })}
            />
          </div>
          <div className="walletbtn blue-text text-lighten-2 waves-effect waves-light">
            Add
          </div>
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

export default Add;