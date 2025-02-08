import React, { useEffect, useRef, useState } from 'react';

//utils
import { signedurltype } from '../../utils/types';
import { useAuth, useLogged } from '../../utils/hooks/useAuth';
import { getSignedUrls, uploadToS3 } from '../../utils/services/s3';

//component
import Patbtn from '../../components/html/Patbtn';
import Askinput from '../../components/html/Askinput';
import Socialbox from '../../components/settings/Socialbox';
import Settingtab from '../../components/settings/Settingtab';

//css, image & types
import "./profilesettings.css";
import { defaultUserPic } from '../../constants/const';
import { USER_S_N_TYPE } from '../../utils/main/types';
import { defaultUPic } from '../../utils/helpers/helpers';
import { handleuserupdatetype, profileprops, userdatatype } from './types';
import { authcontexttype, loggedusercontexttype } from '../../context/types';
import { droppertype, profiletype } from '../../components/html/patdrop/types';
let defaultBackgroundPic: string = require("../../img/defaultbgpic.png");

function Profiletab(profileprops: profileprops) {
  const {
    update,
    handleState,
    handleChange,
    settingState,
  } = profileprops;

  const { userData, profileState } = settingState;
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userRole: number | null = user && user["role"];
  const { updateLoggedUser }: loggedusercontexttype = useLogged();

  const profileRef = useRef<HTMLInputElement | null>(null);
  const wallpicRef = useRef<HTMLInputElement | null>(null);

  //states
  const [showInput, setShowInput] = useState<boolean>(false);
  const [updatedLinks, setUpdatedLinks] = useState<string>("");
  const [showSocialBox, setShowSocialBox] = useState<boolean>(false);

  //handlers 
  const handleUserUpdate: handleuserupdatetype = async (toUpdate: keyof userdatatype, val: USER_S_N_TYPE) => {
    if (!userId) return;

    if (toUpdate === "profile_pic" || toUpdate === "background_pic") {
      const profileFiles = profileRef?.current?.files;
      const wallpicFiles = wallpicRef?.current?.files;

      const picBlob = (profileFiles && profileFiles.length > 0 ? profileFiles[0] : null) ||
        (wallpicFiles && wallpicFiles.length > 0 ? wallpicFiles[0] : null);

      if (picBlob) {
        try {
          const fileName = `${toUpdate}.${picBlob.type.split('/')[1]}`;
          const uploadUrls: signedurltype[] = await getSignedUrls({
            userId: "0",
            req: "PUT",
            postId: "0",
            files: [{ name: fileName, type: picBlob.type }],
          });

          const pic = uploadUrls[0].fileUrl;

          handleState({ type: "UPDATE_USERDATA", userData: { [toUpdate]: pic } });

          const msg = await update(toUpdate, pic);
          const file = new File([picBlob], fileName, { type: picBlob.type });

          await uploadToS3({
            url: uploadUrls[0].signedUrl,
            file: file,
            progress: (prog) => { }
          });

          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: userId!,
            postId: "0",
            req: "GET",
            files: [{ name: pic }]
          });

          if (toUpdate === "profile_pic") {
            handleState({ type: "UPDATE_PIC", profile_pic: signedUrls[0].signedUrl })
            updateLoggedUser({ "profile_pic": signedUrls[0].signedUrl })
          } else if (toUpdate === "background_pic") {
            handleState({ type: "UPDATE_BG_PIC", background_pic: signedUrls[0].signedUrl })
          }

          handleState({
            type: "SET_ERROR",
            error: {
              show: true,
              status: 200,
              message: msg
            }
          });
        } catch (err) {
          handleState({
            type: "SET_ERROR",
            error: {
              show: true,
              status: 500,
              message: "Settings update failed: Something went wrong",
            }
          });
        }
      }
    } else {
      try {
        const msg = await update(toUpdate, val!);

        handleState({ type: "UPDATE_USERDATA", userData: { [toUpdate]: val } });
        handleState({
          type: "SET_ERROR",
          error: {
            show: true,
            status: 200,
            message: msg
          }
        });
      } catch (err) {
        handleState({
          type: "SET_ERROR",
          error: {
            show: true,
            status: 500,
            message: "Settings update failed: Try again..."
          }
        });
      }
    }
  };

  const profiletypeDropperprofile: profiletype = { set: userData.privacy };
  const profiletypeDroppers: droppertype[] = [
    {
      title: "PUBLIC", icn: "person_outline",
      state: "CLICKED", event: () => handleUserUpdate("privacy", "PUBLIC")
    },
    {
      title: "PRIVATE", icn: "lock_outline",
      state: "CLICKED", event: () => handleUserUpdate("privacy", "PRIVATE")
    },
  ];

  useEffect(() => {
    if (updatedLinks.length > 0) {
      handleState({ type: "UPDATE_USERDATA", userData: { social_links: updatedLinks } });
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
              alt="profile_pic"
              onError={defaultUPic}
              src={settingState?.display_profile_pic || defaultUserPic}
            />
          </div>
          <div className="waves-effect waves-light wallpicwrapper">
            <img
              alt="wall_pic"
              className="wallpic"
              onError={(e: any) => (e.target.src = defaultBackgroundPic)}
              src={settingState?.display_background_pic || defaultBackgroundPic}
            />
          </div>
        </div>
        <div className="usettingitems">
          <input
            type="file"
            accept="image/*"
            ref={profileRef}
            id="profileinput"
            name="profile_pic"
            disabled={userRole === 1337}
            onChange={() => handleUserUpdate("profile_pic", "")}
          />
          <label htmlFor="profileinput">
            <div className="picchangebtn waves-effect waves-light themefontbg">
              Update
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            id="wallpicinput"
            name="background_pic"
            ref={wallpicRef}
            disabled={userRole === 1337}
            onChange={() => handleUserUpdate("background_pic", "")}
          />
          <label htmlFor="wallpicinput">
            <div className="picchangebtn waves-effect waves-light themefontbg">
              Update
            </div>
          </label>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> About </div>
            <div className="usettingitemmetatitle">
              {showInput ? (
                <div className="updateinput">
                  <Askinput
                    name="about"
                    maxlength={89}
                    value={userData?.about || ""}
                    placeholder={userData.about || `I m ${userData.username}, A guy with some powers.`}
                    onChange={(e: any) => handleState({ type: "UPDATE_USERDATA", userData: { about: e.target.value } })}
                  />
                </div>
              ) : (
                <>
                  {userData.about || "A brief description of yourself shown on your profile."}
                </>
              )}
            </div>
          </div>
          <Patbtn
            state={showInput && (!userData?.about || userData?.about?.length === 0) ? "clear" : "selected"}
            text={showInput ? (!userData?.about || userData?.about?.length === 0) ? "cancel" : "update" : "change"}
            handleClick={showInput
              ? (!userData?.about || userData?.about?.length === 0)
                ? () => setShowInput(false)
                : () => { handleUserUpdate("about", userData?.about); setShowInput(false) }
              : () => setShowInput(true)}
          />
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Social links </div>
            <div className="usettingitemmetatitle">
              People who visit your profile will see social links.
            </div>
          </div>
          <Patbtn
            text={showSocialBox ? "hide" : "Update"}
            state={!showSocialBox ? "inactive" : "selected"}
            handleClick={() => setShowSocialBox(!showSocialBox)}
          />
        </div>
        <div className="usettingtitlemeta"> PROFILE CATEGORY </div>
        <Settingtab
          type={"drop"}
          title={"Profile"}
          droppers={profiletypeDroppers}
          dropperProfile={profiletypeDropperprofile}
        />
        <Settingtab
          name={"nsfw"}
          type={"switch"}
          value={profileState.nsfw}
          title={"NSFW (Not Safe For Work)"}
          handleChange={(e: any) => handleChange(e, "profile")}
          metatitle={"This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18)."}
        />
        <div className="usettingtitlemeta"> ADVANCED </div>
        <Settingtab
          type={"switch"}
          name={"allowppltofollow"}
          title={"Allow people to follow you"}
          value={profileState?.allowppltofollow}
          handleChange={(e: any) => handleChange(e, "profile")}
          metatitle={"Followers will be notified about posts you make to your profile and see them in their home feed."}
        />
        <Settingtab
          type={"switch"}
          name={"contentvisiblity"}
          title={"Content Visibility"}
          value={profileState.contentvisiblity}
          handleChange={(e: any) => handleChange(e, "profile")}
          metatitle={"Posts to this profile can appear in c/popular or home feed of users who are following you."}
        />
      </div>
      {showSocialBox && (
        <div className="actionboxes">
          <Socialbox
            setUpdatedLinks={setUpdatedLinks}
            setShowSocialBox={setShowSocialBox}
            socialMediaLinks={userData.social_links}
            handleUpdate={() => handleUserUpdate("social_links", userData?.social_links)}
          />
        </div>
      )}
    </>
  )
}

export default Profiletab;