import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import { defaultUPic, generateRoomCode } from "../../utils/helpers";
import { useAuth } from "../../utils/hooks/useAuth";
import { checkChatroomExists, createNewChatroom } from "../../utils/chatopx";
import { changeToThemeColor } from "../../utils/themeopx";

//components
import Patpicer from "../html/Patpicer";

//queries & mutations
import { FOLLOWUSER, GETNOTIFICATIONS } from "../navbar/queries";
import { INSERTUSERCOMMUNITY, REMOVEUSERCOMMUNITY, SENDFOLLOWREQ, REMOVEFOLLOWER, REMOVEFOLLOWREQ } from "../queries/infosection";

//css, images & types
import "./css/infoabout.css";
import { infoaboutpropstype } from "./types";
import { authcontexttype } from "../../context/types";
import { chatgroupusertype } from "../chatbox/types";
import { FOLLOWINGTYPE, NOTIFICATIONTYPE } from "../../utils/main/types";
import { notificationtype } from "../navbar/types";
let bgpic: string = require("../../img/defaultbgpic.png");

const Infoabout = (infoaboutprops: infoaboutpropstype) => {
  const { data, userdata, setError } = infoaboutprops;

  const navigate = useNavigate();

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);
  const userName: string | null = user && user["username"];
  const userRole: number | null = user && (user["role"]);

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
              community_id: Number(data?.id)
            }
          }
        });
      } else {
        await joincommunity({
          variables: {
            data: {
              user_id: userId,
              community_id: Number(data?.id)
            }
          }
        });
      }

      data?.setInCommunity(!data?.inCommunity);

    } else {
      navigate("/account/login");
    }
  }

  const sendRequest: (type: NOTIFICATIONTYPE) => Promise<void> = async (type: NOTIFICATIONTYPE) => {
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
      setError({
        message: "Something went wrong: Not able to send request",
        status: 500,
        show: true
      });

      setFollowing((prev) => prev);
      setIsChatBuddy((prev) => prev);
    }
  }

  const removeReq: () => Promise<void> = async () => {
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
      setError({
        message: "Uh! Oh, Something went wrong",
        status: 500,
        show: true
      });
      setFollowing((prev) => prev);
      setIsChatBuddy((prev) => prev);
    }
  }

  const handleUserFollow: (type: NOTIFICATIONTYPE) => Promise<void> = async (type: NOTIFICATIONTYPE) => {
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
              if (data?.userSettings.privacy === "PRIVATE") {
                data?.updateUserSettings({
                  type: "UPDATE", payload: { showProfile: false, following: "FOLLOW" }
                });
              } else {
                data?.updateUserSettings(
                  { type: "UPDATE_FOLLOWING", payload: { following: "FOLLOW" } }
                );
              }
            }
          });
        } else if (following === "REQUESTED") {
          await removeReq().then(() => {
            setFollowing("FOLLOW");
            data?.updateUserSettings({ type: "UPDATE_FOLLOWING", payload: { following: "FOLLOW" } });
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
                data?.updateUserSettings({ type: "UPDATE_FOLLOWING", payload: { following: "FOLLOWING" } });
              }
            });
          } else {
            await sendRequest(type);
            data?.updateUserSettings({ type: "UPDATE_FOLLOWING", payload: { following: "REQUESTED" } });
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
            const roomCode = generateRoomCode([userId!, data?.id], false);
            const newRoom = await createNewChatroom(roomCode, userId!, [chatUser]);

            if (newRoom.status === 200 || newRoom.status === 0) {
              setError({
                message: `${newRoom?.message} with ${data?.username}`,
                status: newRoom.status,
                show: true
              })
            } else {
              setError({
                message: `Something went wrong: Patching failed with ${data?.username}`,
                status: newRoom.status,
                show: true
              })
            }
          } else {
            const isChatroomExists = await checkChatroomExists([userId!, data?.id]);
            if (isChatroomExists.status === 0) {
              setError({
                message: `Chatroom already exists with ${data?.username}`,
                status: isChatroomExists.status,
                show: true
              });
            } else if (isChatroomExists.status === 404) {
              await sendRequest(type);
            } else {
              setError({
                message: `Something went wrong: Patching failed with ${data?.username}`,
                status: isChatroomExists.status,
                show: true
              })
            }
          }
        } else if (isChatBuddy === "REQUESTED") {
          await removeReq().then(() => {
            setIsChatBuddy("CHAT");
          });
        }
      }
    } catch (err) {
      setError({
        message: "Uh! Oh, Something went wrong",
        status: 500,
        show: true
      });
    }
  }

  useEffect(() => {
    if (!userdata && data) {
      if (data?.theme && data?.theme.length > 0) {
        changeToThemeColor(data?.theme);
      }
    }

    if (userdata && data) {
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
                  data?.updateUserSettings({ type: "UPDATE_FOLLOWING", payload: { following: "REQUESTED" } });
                }

                if (notification.type === "CHAT") {
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
                className="useroverviewpic"
                src={data?.profile_pic}
                onError={defaultUPic}
                onClick={() => { setPics([data?.profile_pic]); setShowPics(true) }}
              />
            </div>
            <div className="userinfoname">
              {data?.status === "ACTIVE" ? data?.username : "deleted"}
            </div>
            {userName === data?.username ? (
              <Link to={`/u/${data?.username}/settings/profile`} className="usersettingicn">
                <i className="material-icons usersettingicn"> settings </i>
              </Link>
            ) : (
              <div className="followbtnwrapper">
                {following !== "FOLLOWING" && (
                  <div
                    onClick={() => handleUserFollow("CHAT")}
                    className="waves-effect waves-light followbtn"
                  >
                    {isChatBuddy.toLowerCase()}
                  </div>
                )}
                {data?.userSettings?.allowPplToFollow && (
                  <div
                    onClick={() => handleUserFollow("FRIEND")}
                    className="waves-effect waves-light followbtn"
                  >
                    {following.toLowerCase()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {!userdata ? (
          <>
            <div className="followbtnwrapper">
              <div className="waves-light waves-effect followbtn themecolor">
                chat
              </div>
              {data?.owner?.id !== userId ? (
                <div
                  onClick={handleCommunityJoin}
                  className={`waves-light waves-effect ${data?.inCommunity ? "unfollowbtn" : "followbtn themecolor"}`}
                >
                  {data?.inCommunity ? "leave" : "join"}
                  {!data?.inCommunity && (
                    <i className="material-icons followbtnicn"> gavel </i>
                  )}
                </div>
              ) : (
                <Link to={`/c/${data?.communityname}/settings`} className="waves-light waves-effect followbtn themecolor">
                  {data?.communityname}
                  <i className="material-icons followbtnicn"> settings </i>
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
            {(userName === data?.username && userRole === 0) && (
              <div className="usersubtnwrapper" onClick={() => navigate("/su/profile")}>
                <div className="usersubtn waves-light waves-effect"> superuser </div>
              </div>
            )}
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
      </div>
      <Patpicer
        pics={pics}
        showPic={showPics}
        setShowPic={setShowPics}
      />
    </>
  );
}

export default Infoabout;
