import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';

//utils
import { uploadToS3, getSignedUrls } from '../../utils/services/s3';

//components
import Patbtn from '../../components/html/Patbtn';
import Askinput from '../../components/html/Askinput';
import Textbox from '../../components/settings/Textbox';
import Socialbox from '../../components/settings/Socialbox';
import Settingtab from '../../components/settings/Settingtab';

//queries
import { UPSERTCOMMUNITY } from './queries';

//types, images & const
import { handlecommunityupdatetype, profiletabpropstype } from './types';
import { signedurltype } from '../../utils/types';
import { defaultCommunityPic } from '../../constants/const';
import { droppertype, profiletype } from '../../components/html/patdrop/types';
let defaultBackgroundPic: string = require("../../img/defaultbgpic.png");

function ProfileTab(profiletabprops: profiletabpropstype) {
  const { cname, handleState, communityState } = profiletabprops;
  const { about, description, social_links, theme, privacy } = communityState?.data;

  const communityWallRef = useRef<HTMLInputElement | null>(null);
  const communityProfileRef = useRef<HTMLInputElement | null>(null);

  //states
  const [updatedLinks, setUpdatedLinks] = useState<string>("");
  const [showSocialBox, setShowSocialBox] = useState<boolean>(false);
  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);

  //queries
  const [updateCommunity] = useMutation(UPSERTCOMMUNITY);

  //handlers
  const handleCommunityUpdate: handlecommunityupdatetype = async (update: string, val: string) => {
    try {
      let updatedState = {
        ...communityState?.data,
        [update]: val
      }
      if (update === "background_pic" || update === "profile_pic") {
        const profileFiles = communityProfileRef?.current?.files;
        const wallpicFiles = communityWallRef?.current?.files;

        const picBlob = (profileFiles && profileFiles.length > 0 ? profileFiles[0] : null) ||
          (wallpicFiles && wallpicFiles.length > 0 ? wallpicFiles[0] : null);

        if (picBlob) {
          const fileName = `${cname}_${update}.${picBlob.type.split('/')[1]}`;

          const uploadUrls: signedurltype[] = await getSignedUrls({
            userId: "0",
            req: "PUT",
            postId: "0",
            files: [{ name: fileName, type: picBlob.type }],
          });

          const pic = uploadUrls[0].fileUrl;
          updatedState = {
            ...communityState?.data,
            [update]: pic
          }

          await updateCommunity({
            variables: {
              data: {
                name: cname!,
                ...updatedState
              }
            },
            onCompleted: () => {
              handleState({ type: "UPDATE_COMMUNITYDATA", communityData: { ...updatedState } });
              handleState({
                type: "SET_ERROR",
                error: {
                  status: 200,
                  show: true,
                  message: "Settings updated Successfully"
                }
              });

              setShowInput(false);
            }
          });

          const file = new File([picBlob], fileName, { type: picBlob.type });
          await uploadToS3({
            url: uploadUrls[0].signedUrl,
            file: file,
            progress: (prog) => { }
          });

          const signedUrls: signedurltype[] = await getSignedUrls({
            userId: communityState?.data?.owner,
            postId: "0",
            req: "GET",
            files: [{ name: pic }]
          });

          if (update === "profile_pic") {
            handleState({ type: "UPDATE_PIC", profile_pic: signedUrls[0].signedUrl })
          } else if (update === "background_pic") {
            handleState({ type: "UPDATE_BG_PIC", background_pic: signedUrls[0].signedUrl })
          }
        }
      } else {
        await updateCommunity({
          variables: {
            data: {
              name: cname!,
              ...updatedState
            }
          },
          onCompleted: () => {
            handleState({ type: "UPDATE_COMMUNITYDATA", communityData: { ...updatedState } });
            handleState({
              type: "SET_ERROR",
              error: {
                status: 200,
                show: true,
                message: "Settings updated Successfully"
              }
            });

            setShowInput(false);
          }
        });
      }
    } catch (err) {
      handleState({ type: "RESET" });
      handleState({
        type: "SET_ERROR",
        error: {
          status: 500,
          show: true,
          message: "Something went wrong: Settings update failed"
        }
      });
    }
  }

  const privacyDropperprofile: profiletype = { set: privacy, name: "privacy" };
  const privacyDroppers: droppertype[] = [
    {
      title: "PUBLIC", icn: "person_outline",
      state: "CLICKED", event: () => handleCommunityUpdate("privacy", "PUBLIC")
    },
    {
      title: "PRIVATE", icn: "lock_outline",
      state: "CLICKED", event: () => handleCommunityUpdate("privacy", "PRIVATE")
    },
  ];

  useEffect(() => {
    if (updatedLinks.length > 0) {
      handleState({ type: "UPDATE_COMMUNITYDATA", communityData: { social_links: updatedLinks } });
    }
  }, [updatedLinks]);

  console.log(communityState?.data)

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
              src={communityState?.show_profile_pic || defaultCommunityPic}
            />
          </div>
          <div className="waves-effect waves-light wallpicwrapper">
            <img
              alt="wall_pic"
              className="wallpic"
              src={communityState.show_background_pic || defaultBackgroundPic}
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
            onChange={() => handleCommunityUpdate("profile_pic", "")}
          />
          <label htmlFor="community_profile">
            <div className="picchangebtn waves-effect waves-light themecolor">
              Update
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            name="background_pic"
            id="community_wall"
            ref={communityWallRef}
            onChange={() => handleCommunityUpdate("background_pic", "")}
          />
          <label htmlFor="community_wall">
            <div className="picchangebtn waves-effect waves-light themecolor">
              Update
            </div>
          </label>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> About </div>
            <div className="usettingitemmetatitle thememetanhtext">
              {showInput ? (
                <div className="updateinput">
                  <Askinput
                    name="about"
                    maxlength={89}
                    value={about}
                    placeholder={about || "Tell us something about your community in one line."}
                    onChange={(e: any) => handleState({
                      type: "UPDATE_COMMUNITYDATA",
                      communityData: { about: e.target.value }
                    })}
                  />
                </div>
              ) : (
                about || "Describe your community in one line or so."
              )}
            </div>
          </div>
          <Patbtn
            theme={true}
            text={showInput ? about.length > 1 ? "update" : "cancel" : "change"}
            state={showInput && about.length < 1 ? "clear" : "selected"}
            handleClick={!showInput
              ? () => setShowInput(true)
              : () => { about.length > 0 ? handleCommunityUpdate("about", about) : setShowInput(false) }
            }
          />
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Description </div>
            <div className="usettingitemmetatitle thememetanhtext">
              Tell people what your community moto & is all about.
            </div>
          </div>
          <Patbtn
            text={showTextBox ? "hide" : "Update"}
            state={showTextBox ? "selected" : "inactive"}
            handleClick={() => setShowTextBox(prev => !prev)}
          />
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Social links </div>
            <div className="usettingitemmetatitle thememetanhtext">
              People who visit community will see social links.
            </div>
          </div>
          <Patbtn
            text={showSocialBox ? "hide" : "Update"}
            state={showSocialBox ? "selected" : "inactive"}
            handleClick={() => setShowSocialBox(prev => !prev)}
          />
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
              value={theme}
              onChange={(e) => handleCommunityUpdate("theme", e.target.value)}
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
          <Patbtn
            text={"delete"}
            state={"clear"}
            handleClick={() => handleState({ type: "DELETE_ACCOUNT", deleteAcc: true })}
          />
        </div>
      </div >
      <div className="actionboxes">
        {showSocialBox && (
          <Socialbox
            setUpdatedLinks={setUpdatedLinks}
            setShowSocialBox={setShowSocialBox}
            socialMediaLinks={social_links}
            handleUpdate={() => handleCommunityUpdate("social_links", social_links!)}
          />
        )}
        {showTextBox && (
          <Textbox
            name={"description"}
            setShowTextBox={setShowTextBox}
            value={description}
            handleUpdate={() => handleCommunityUpdate("description", description)}
            handleChange={(e: any) => handleState({
              type: "UPDATE_COMMUNITYDATA",
              communityData: { description: e.target.value }
            })}
          />
        )}
      </div>
    </>
  )
}

export default ProfileTab;