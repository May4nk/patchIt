import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useAuth } from "../common/hooks/useAuth";
//component
import Askinput from './html/Askinput';
//query
import { UPDATEUSER } from "../common/loginqueries";
//css & types
import "./css/modalcomponent.css";
import { authcontexttype } from "../context/types";
import { userdatatype } from "../containers/profileSettings/profilesettingtypes";
let logo: string = require("../img/logo.png");
interface modalprops {
  btntxt?: string;
  txt?: string;
  placeholder?: string;
  toUpdate: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  userData: userdatatype;
  setUserData: React.Dispatch<React.SetStateAction<userdatatype>>;
}

function Modalcomponent(modalprops: modalprops) {
  const { showModal, setShowModal, userData, setUserData, btntxt, placeholder, txt, toUpdate } = modalprops;

  const show: string = showModal ? "block" : "none";
  const { user, logout }: authcontexttype = useAuth();
  const userId: number | null = user && (user["user_id"] | user["id"]);
  const username: string | null = user && (user["username"]);
  //queries
  const [updateUser] = useMutation(UPDATEUSER);
  //states
  const [userUpdates, setUserUpdates] = useState<string>("");
  //handlers
  const handleClose: () => void = () => {
    setShowModal(false);
    setUserUpdates("");
  }

  const handleUpdateUser: (toUpdate: string) => void = (toUpdate: string) => {
    if (userId) {
      updateUser({
        variables: {
          data: {
            id: userId,
            [toUpdate]: userUpdates
          }
        }
      }).then(() => {
        setShowModal(false);
        setUserUpdates("");
        setUserData({ ...userData, [toUpdate]: userUpdates });
      });
    }
  };

  const handleDeleteAcc: () => void = () => {
    if (userUpdates === `delete/${username}`) {
      updateUser({
        variables: {
          data: {
            id: userId,
            status: "INACTIVE",
          }
        }
      });
      logout();
    }
  };

  useEffect(() => {
    if (toUpdate !== "status") {
      setUserUpdates(userData[toUpdate as keyof userdatatype]);
    }
  }, [toUpdate, userData]);

  return (
    <div className={show}>
      <div className="overlay">
        <div className="modal">
          <div className="modallogowrapper">
            <img src={logo} alt={"logo"} className="modallogo" />
          </div>
          {txt || "Are you sure you want to update these changes?"}
          <div className="modalinput">
            <Askinput
              placeholder={placeholder || ""}
              value={userUpdates}
              onChange={(e) => setUserUpdates(e.target.value)}
            />
          </div>
          <div className="btnwrapper">
            <div className="actionbtn blue black-text waves-effect waves-light"
              onClick={() => toUpdate === "status" ? handleDeleteAcc() : handleUpdateUser(toUpdate)}
            >
              {btntxt || "update"}
            </div>
            <div className="closebtn red black-text waves-effect waves-light" onClick={handleClose}>
              close
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modalcomponent;