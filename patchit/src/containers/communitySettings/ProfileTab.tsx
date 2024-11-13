import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';

import { changeToBase64 } from '../../utils/opx';

//components
import Askinput from '../../components/html/Askinput';
import Textbox from '../../components/settings/Textbox';
import Socialbox from '../../components/settings/Socialbox';
import Settingtab from '../../components/settings/Settingtab';

//queries
import { UPSERTCOMMUNITY } from './queries';

//types, images & const
import { profiletabpropstype, showinputtype } from './types';
import { defaultCommunityPic } from '../../constants/const';
import { droppertype, profiletype } from '../../components/html/patdrop/types';
let defaultBackgroundPic: string = require("../../img/defaultbgpic.png");

function ProfileTab(profiletabprops: profiletabpropstype) {
  const {
    cname,
    setErrorMessage,
    communityState,
    setCommunityState,
    setDeleteCommunity
  } = profiletabprops;

  const communityWallRef = useRef<HTMLInputElement | null>(null);
  const communityProfileRef = useRef<HTMLInputElement | null>(null);

  //states
  const [updatedLinks, setUpdatedLinks] = useState<string>("");
  const [showSocialBox, setShowSocialBox] = useState<boolean>(false);
  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<showinputtype>({ about: false });

  //queries
  const [updateCommunity] = useMutation(UPSERTCOMMUNITY);

  //handlers
  const handleCommunityUpdate: (update?: string, val?: string) => Promise<void> = async (update?: string, val?: string) => {
    try {
      const updatedState = {
        communityname: cname,
        ...communityState,
      };

      if (update && val) {
        updatedState[update] = val;
      }

      await updateCommunity({
        variables: {
          data: updatedState
        },
        onCompleted: () => {
          setErrorMessage({
            status: 200,
            show: true,
            message: "Settings updated Successfully"
          });

          setShowInput({ about: false });
        }
      });
    } catch (err) {
      setCommunityState(prev => ({ ...prev }));
      setErrorMessage({
        status: 500,
        show: true,
        message: "Something went wrong: Settings update failed"
      });
    }
  }

  const handleThemeAndPrivacyChange: (toUpdate: string, val: string) => void = async (toUpdate: string, val: string) => {
    setCommunityState({
      ...communityState,
      [toUpdate]: val
    });

    handleCommunityUpdate(toUpdate, val);
  }

  const privacyDropperprofile: profiletype = { set: communityState?.privacy, name: "privacy" };

  const privacyDroppers: droppertype[] = [
    {
      title: "PUBLIC", icn: "person_outline",
      state: "CLICKED", event: () => handleThemeAndPrivacyChange("privacy", "PUBLIC")
    },
    {
      title: "PRIVATE", icn: "lock_outline",
      state: "CLICKED", event: () => handleThemeAndPrivacyChange("privacy", "PRIVATE")
    },
  ];

  const handleInput = (communityblock: "about" | "description") => {
    if (communityState[communityblock].length > 0) {
      handleCommunityUpdate()
    }
    setShowInput({ ...showInput, [communityblock]: false });
  }

  const handleCommunityPicChange: (toUpdate: string) => Promise<void> = async (toUpdate: string) => {
    const profileFiles = communityProfileRef?.current?.files;
    const wallpicFiles = communityWallRef?.current?.files;

    const picBlob = (profileFiles && profileFiles.length > 0 ? profileFiles[0] : null) ||
      (wallpicFiles && wallpicFiles.length > 0 ? wallpicFiles[0] : null);

    try {
      if (picBlob) {
        const pic = await changeToBase64(picBlob);

        setCommunityState({ ...communityState, [toUpdate]: pic });

        await updateCommunity({
          variables: {
            data: {
              communityname: cname,
              [toUpdate]: pic
            }
          }
        });
      }
    } catch (err) {
      setErrorMessage({
        status: 500,
        show: true,
        message: "Something went wrong: Settings update failed"
      });
    }
  }

  useEffect(() => {
    if (updatedLinks.length > 0) {
      setCommunityState({ ...communityState, social_links: updatedLinks });
    }
  }, [updatedLinks]);

  return (
    <>
      <div className="usetting">
        <div className="usettingtitle"> Customize profile </div>
        <div className="usettingtitlemeta"> PROFILE INFO </div>
        <div className="usettingitems">
          <div className="waves-effect waves-light picwrapper">
            <img
              className="pic"
              alt="community_pic"
              src={communityState?.profile_pic || defaultCommunityPic}
            />
          </div>
          <div className="waves-effect waves-light wallpicwrapper">
            <img
              alt="wall_pic"
              className="wallpic"
              src={communityState.background_pic || defaultBackgroundPic}
            />
          </div>
        </div>
        <div className="usettingitems">
          <input
            type="file"
            accept="image/*"
            name="profile_pic"
            id="community_profile"
            ref={communityProfileRef}
            onChange={() => handleCommunityPicChange("profile_pic")}
          />
          <label htmlFor="community_profile">
            <div className="usettingitembtn waves-effect waves-light black-text themebg ">
              Update
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            name="background_pic"
            id="community_wall"
            ref={communityWallRef}
            onChange={() => handleCommunityPicChange("background_pic")}
          />
          <label htmlFor="community_wall">
            <div className="usettingitembtn waves-effect waves-light black-text themebg ">
              Update
            </div>
          </label>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> About </div>
            <div className="usettingitemmetatitle thememetanhtext">
              {showInput.about ? (
                <div className="updateinput">
                  <Askinput
                    name="about"
                    maxlength={89}
                    value={communityState.about}
                    placeholder={communityState.about || "Tell us something about your community in one line."}
                    onChange={(e: any) => setCommunityState({ ...communityState, about: e.target.value })}
                  />
                </div>
              ) : (
                communityState.about || "Describe your community in one line or so."
              )}
            </div>
          </div>
          <div
            className={`waves-effect waves-light black-text ${showInput.about && "themebg"} usettingitembtn themeinactivebtnbg`}
            onClick={showInput.about
              ? () => handleInput("about")
              : () => setShowInput({ ...showInput, about: true })
            }
          >
            {showInput.about ? "update" : "change"}
          </div>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Description </div>
            <div className="usettingitemmetatitle thememetanhtext">
              Tell people what your community moto & is all about.
            </div>
          </div>
          <div
            className="waves-effect waves-light black-text usettingitembtn themeinactivebtnbg"
            onClick={() => setShowTextBox(!showTextBox)}
          >
            {showTextBox ? "hide" : "Update"}
          </div>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Social links </div>
            <div className="usettingitemmetatitle thememetanhtext">
              People who visit community will see social links.
            </div>
          </div>
          <div
            className="waves-effect waves-light black-text usettingitembtn themeinactivebtnbg"
            onClick={() => setShowSocialBox(!showSocialBox)}
          >
            {showSocialBox ? "hide" : "Update"}
          </div>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Theme </div>
            <div className="usettingitemmetatitle thememetanhtext"> Community theme </div>
          </div>
          <div className="usettingitemchange">
            <Askinput
              name={"theme"}
              type={"color"}
              value={communityState.theme}
              onChange={(e) => setCommunityState((prev) => ({ ...prev, theme: e.target.value }))}
            />
          </div>
        </div>
        <div className="usettingtitlemeta"> PROFILE </div>
        <Settingtab
          type={"drop"}
          title={"Privacy"}
          droppers={privacyDroppers}
          dropperProfile={privacyDropperprofile}
        />
        <div className="usettingtitlemeta"> ADVANCED </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Delete community </div>
            <div className="usettingitemmetatitle thememetanhtext">{cname}</div>
          </div>
          <div className="waves-effect waves-light black-text red usettingitembtn" onClick={() => setDeleteCommunity(true)}>
            delete
          </div>
        </div>
      </div>
      <div className="actionboxes">
        {showSocialBox && (
          <Socialbox
            setUpdatedLinks={setUpdatedLinks}
            setShowSocialBox={setShowSocialBox}
            handleUpdate={handleCommunityUpdate}
            socialMediaLinks={communityState.social_links}
          />
        )}
        {showTextBox && (
          <Textbox
            name={"description"}
            setShowTextBox={setShowTextBox}
            value={communityState.description}
            handleUpdate={handleCommunityUpdate}
            handleChange={(e: any) => setCommunityState({ ...communityState, description: e.target.value })}
          />
        )}
      </div>
    </>
  )
}

export default ProfileTab;