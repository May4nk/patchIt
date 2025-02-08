import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

//utils
import { useAuth } from "../../utils/hooks/useAuth";
import { defaultUPic } from "../../utils/helpers/helpers";
import { changeToThemeColor } from "../../utils/opx/communityopx";
import { checkChatroomExists, createNewChatroom } from "../../utils/opx/chatopx";

//components
import Patbtn from "../html/Patbtn";
import Patpicer from "../html/Patpicer";

//queries & mutations
import { FOLLOWUSER, GETNOTIFICATIONS } from "../navbar/queries";
import {
  INSERTUSERCOMMUNITY,
  REMOVEUSERCOMMUNITY,
  REMOVEFOLLOWREQ,
  REMOVEFOLLOWER,
  SENDFOLLOWREQ,
} from "../queries/infosection";

//css, images & types
import "./css/infoabout.css";
import { infoaboutpropstype, sendnotificationreqtype } from "./types";
import { notificationtype } from "../navbar/types";
import { authcontexttype } from "../../context/types";
import { chatgroupusertype } from "../chatbox/types";
import { FOLLOWINGTYPE, NOTIFYTYPE, USER_S_N_TYPE } from "../../utils/main/types";
import { defaultUserPic } from "../../constants/const";

let bgpic: string = require("../../img/defaultbgpic.png");

const Infoabout = (infoaboutprops: infoaboutpropstype) => {
  const { data, userdata } = infoaboutprops;
  const navigate = useNavigate();

  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userName: string | null = user && user["username"];
  const roomName: USER_S_N_TYPE = userdata ? `${data.username}-${userName}` : null;

  //states
  const [pics, setPics] = useState<string[]>([]);
  const [showPics, setShowPics] = useState<boolean>(false);
  const [isChatBuddy, setIsChatBuddy] = useState("CHAT");
  const [following, setFollowing] = useState<FOLLOWINGTYPE>("FOLLOW");

  //queries
  const [followUser] = useMutation(FOLLOWUSER);
  const [sendFollowReq] = useMutation(SENDFOLLOWREQ);
  const [removeFollower] = useMutation(REMOVEFOLLOWER);
  const [removeFollowReq] = useMutation(REMOVEFOLLOWREQ);
  const [joincommunity] = useMutation(INSERTUSERCOMMUNITY);
  const [leavecommunity] = useMutation(REMOVEUSERCOMMUNITY);
  const [getNotifications] = useLazyQuery(GETNOTIFICATIONS);

  //handlers
  const backgroundPic = data?.background_pic || bgpic;

  const handleCommunityJoin: () => Promise<void> = async () => {
    if (user && !userdata) {
      if (data?.inCommunity) {
        await leavecommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: data?.id
            }
          }
        });
      } else {
        await joincommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: data?.id
            }
          }
        });
      }

      data?.updateCommunitySettings({ type: "UPDATE_IN_COMMUNITY", inCommunity: !data?.inCommunity });

    } else {
      navigate("/account/login");
    }
  }

  const sendRequest: sendnotificationreqtype = async (type: NOTIFYTYPE) => {
    if (!userdata) {
      return;
    }

    try {
      await sendFollowReq({
        variables: {
          data: {
            touser: data?.id,
            fromuser: userId,
            type: type,
            message: `${userName} sent you ${type.toLowerCase()} request`,
            status: "PENDING"
          }
        },
        onCompleted: () => {
          type === "FRIEND"
            ? setFollowing("REQUESTED")
            : setIsChatBuddy("REQUESTED");
        }
      });
    } catch (err) {
      data?.updateUserSettings({
        type: "SET_ERROR",
        error: { show: true, status: 500, message: "Request failed: Something went wrong" }
      });

      setFollowing((prev) => prev);
      setIsChatBuddy((prev) => prev);
    }
  }

  const removeReq: () => Promise<void> = async () => {
    if (!userdata) {
      return;
    }

    try {
      await removeFollowReq({
        variables: {
          data: {
            touser: data?.id,
            fromuser: userId,
          }
        }
      });
    } catch (err) {
      data?.updateUserSettings({
        type: "SET_ERROR",
        error: { show: true, status: 500, message: "Request failed: Something went wrong" }
      });

      setFollowing((prev) => prev);
      setIsChatBuddy((prev) => prev);
    }
  }

  const handleUserFollow: sendnotificationreqtype = async (type: NOTIFYTYPE) => {
    if (!user) {
      navigate("/account/login");
      return;
    }

    if (!userdata) return;

    try {
      if (type === "FRIEND") {
        if (following === "FOLLOWING") {
          await removeFollower({
            variables: {
              data: {
                follower: userId,
                following: data?.id
              }
            },
            onCompleted: () => {
              setFollowing("FOLLOW");
              if (data?.userSettings.isProfilePrivate) {
                data?.updateUserSettings({
                  type: "UPDATE_SETTINGS",
                  settings: {
                    isProfilePrivate: true,
                    following: "FOLLOW"
                  }
                });
              } else {
                data?.updateUserSettings(
                  { type: "UPDATE_SETTINGS", settings: { following: "FOLLOW" } });
              }
            }
          });
        } else if (following === "REQUESTED") {
          await removeReq().then(() => {
            setFollowing("FOLLOW");
            data?.updateUserSettings(
              { type: "UPDATE_SETTINGS", settings: { following: "FOLLOW" } }
            );
          });
        } else {
          if (data?.privacy === "PUBLIC") {
            await followUser({
              variables: {
                data: {
                  follower: userId,
                  following: data?.id
                }
              },
              onCompleted: () => {
                setFollowing("FOLLOWING");
                data?.updateUserSettings(
                  { type: "UPDATE_SETTINGS", settings: { following: "FOLLOWING" } }
                );
              }
            });
          } else {
            await sendRequest(type);
            data?.updateUserSettings(
              { type: "UPDATE_SETTINGS", settings: { following: "REQUESTED" } }
            );
          }
        }
      } else if (type === "CHAT") {
        if (isChatBuddy === "CHAT") {
          const chatUser: chatgroupusertype = {
            id: data?.id,
            username: data?.username,
            profile_pic: data?.profile_pic
          }

          if (data?.privacy === "PUBLIC") {
            const newRoom = await createNewChatroom({
              ownerId: userId!,
              roomName: roomName!,
              chatgroupUsers: [chatUser],
            });

            console.log(newRoom);
            if (newRoom.status === 200 || newRoom.status === 0) {
              data?.updateUserSettings({
                type: "SET_ERROR",
                error: {
                  message: `${newRoom?.message} with ${data?.username}`,
                  status: newRoom.status,
                  show: true
                }
              })
            } else {
              data?.updateUserSettings({
                type: "SET_ERROR",
                error: {
                  message: `Something went wrong: Patching failed with ${data?.username}`,
                  status: newRoom.status,
                  show: true
                }
              })
            }
          }
          else {
            const isChatroomExists = await checkChatroomExists(roomName!);
            if (isChatroomExists.status === 0) {
              data?.updateUserSettings({
                type: "SET_ERROR",
                error: {
                  message: `Chatroom already exists with ${data?.username}`,
                  status: isChatroomExists.status,
                  show: true
                }
              });
            } else if (isChatroomExists.status === 404) {
              await sendRequest(type);
            } else {
              data?.updateUserSettings({
                type: "SET_ERROR",
                error: {
                  message: `Something went wrong: Patching failed with ${data?.username}`,
                  status: isChatroomExists.status,
                  show: true
                }
              });
            }
          }
        } else if (isChatBuddy === "REQUESTED") {
          await removeReq().then(() => {
            setIsChatBuddy("CHAT");
          });
        }
      }
    } catch (err) {
      data?.updateUserSettings({
        type: "SET_ERROR",
        error: {
          message: "Uh! Oh, Something went wrong",
          status: 500,
          show: true
        }
      });
    }
  }

  useEffect(() => {
    if (!userdata && data) {
      if (data?.theme && data?.theme.length > 0) {
        changeToThemeColor(data?.theme);
      }
    }

    if (userdata && data && userId) {
      setFollowing(data?.userSettings?.following);
      getNotifications({
        variables: {
          filter: {
            status: "PENDING",
            fromuser: userId,
            touser: data?.id
          }
        },
        onCompleted: ({ listNotifications }) => {
          if (listNotifications) {
            if (listNotifications.length > 0) {
              listNotifications.map((notification: notificationtype) => {
                if (notification.type === "FRIEND") {
                  setFollowing("REQUESTED");
                  data?.updateUserSettings(
                    { type: "UPDATE_SETTINGS", settings: { following: "REQUESTED" } }
                  );
                } else if (notification.type === "CHAT") {
                  setIsChatBuddy("REQUESTED");
                }
              })
            }
          }
        }
      });
    }
  }, [data]);

  return (
    <>
      <div className="infocontent">
        <div className={userdata ? "userinfobackgroundpic" : "infobackgroundpicwrapper"}>
          <img
            alt="background_pic"
            src={backgroundPic}
            onClick={() => { setPics([backgroundPic]); setShowPics(true) }}
            className={userdata ? "userinfobackgroundpic" : "infobackgroundpic"}
          />
        </div>
        {userdata && (
          <div className="userinfooverview">
            <div className="overviewuserpicwrapper">
              <img
                alt="profile pic"
                onError={defaultUPic}
                className="useroverviewpic"
                src={data?.profile_pic || defaultUserPic}
                onClick={() => { setPics([(data?.profile_pic || defaultUserPic)]); setShowPics(true) }}
              />
            </div>
            <div className="userinfoname">
              {data?.status === "ACTIVE" ? data?.username : "deleted"}
            </div>
            {userName === data?.username ? (
              <Link to={`/u/${data?.username}/settings`} className="usersettingicn">
                <i className="material-icons usersettingicn"> settings </i>
              </Link>
            ) : (
              <div className="followbtnswrapper">
                {following !== "FOLLOWING" && (
                  <Patbtn
                    size={"small"}
                    state={"selected"}
                    text={isChatBuddy.toLowerCase()}
                    handleClick={() => handleUserFollow("CHAT")}
                  />
                )}
                {data?.userSettings?.allowPplToFollow && (
                  <Patbtn
                    size={"small"}
                    state={"selected"}
                    text={following.toLowerCase()}
                    handleClick={() => handleUserFollow("FRIEND")}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {!userdata ? (
          <>
            <div className="followbtnswrapper">
              <Link to={`/create/post/${data?.name}`}>
                <Patbtn
                  theme={true}
                  text={"post"}
                  size={"small"}
                  lasticn={"add"}
                />
              </Link>
              {data?.owner?.id !== userId ? (
                <Patbtn
                  size={"small"}
                  theme={true}
                  handleClick={handleCommunityJoin}
                  icn={!data?.inCommunity ? "gavel" : ""}
                  text={data?.inCommunity ? "leave" : "join"}
                  state={data?.inCommunity ? "clear" : "selected"}
                />
              ) : (
                <Link to={`/c/${data?.name}/settings`}>
                  <Patbtn
                    size={"small"}
                    theme={true}
                    icn={"settings"}
                    state={"selected"}
                    text={data?.name}
                  />
                </Link>
              )}
            </div>
            <div className="infoaboutpropswrapper">
              <div className="infoaboutprops">
                {data?.users?.length || 0}
                <i className="material-icons infoaboutpropsicn themecolor"> person_outline </i>
              </div>
              <div className="infoaboutprops">
                {data?.posts?.length || 0}
                <i className="material-icons blue-text infoaboutpropsicn themecolor"> center_focus_weak </i>
              </div>
            </div>
            <div className="infoaboutcontent">
              {data?.about || "Explore to know better."}
            </div>
            <div className="themebar themebg"></div>
          </>
        ) : (
          <>
            <div className="infoaboutpropswrapper">
              <div className="infoaboutprops">
                {data?.posts?.length || 0}
                <i className="material-icons infoaboutpropsicn"> center_focus_weak </i>
              </div>
              <div className="infoaboutprops">
                1
                <i className="material-icons infoaboutpropsicn"> blur_on</i>
              </div>
              <div className="infoaboutprops">
                # 2 years
              </div>
            </div>
            <div className="infoaboutheading">
              <i className="material-icons infoicn tiny">sentiment_satisfied</i>
              Me
            </div>
            <div className="infoaboutcontent">
              {data?.status === "ACTIVE"
                ? data?.about || `I m ${data?.username}, A guy with some powers.`
                : "Adios..."
              }
            </div>
          </>
        )}
      </div >
      <Patpicer
        pics={pics}
        showPic={showPics}
        setShowPic={setShowPics}
      />
    </>
  );
}

export default Infoabout;
