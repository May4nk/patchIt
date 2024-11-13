import React, { useState } from 'react';

//components
import Askinput from '../../components/html/Askinput';

//css, images & types
import "./patcoinwallet.css";
import { patcoinsendpropstype, sendpatcointype } from './types';

function Send(patcoinsendprops: patcoinsendpropstype) {
  const { handleWalletMode } = patcoinsendprops;

  //states
  const [sendPatcoin, setSendPatcoin] = useState<sendpatcointype>({
    amnt: 0,
    address: ""
  })

  return (
    <>
      <div className="wallethead blue-text text-lighten-3">
        send
        <div className="walletheadactions">
          <i
            className="material-icons walletheadicn"
            onClick={() => handleWalletMode("add")}
          >
            add
          </i>
          <i
            className="material-icons walletheadicn"
            onClick={() => handleWalletMode("home")}
          >
            home
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
              onChange={(e) => setSendPatcoin({ ...sendPatcoin, amnt: Number(e.target.value) })}
            />
          </div>
          <div className="walletinput">
            <Askinput
              name={"amnt"}
              value={sendPatcoin.address}
              placeholder={"address"}
              onChange={(e) => setSendPatcoin({ ...sendPatcoin, address: e.target.value })}
            />
          </div>
          <div className="walletbtn blue-text text-lighten-2 waves-effect waves-light">
            Send
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

export default Send;