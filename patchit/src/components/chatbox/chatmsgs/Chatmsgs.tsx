import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";

import Askinput from "../../html/Askinput";
import Message from "./Message";
import Chatoptions from "./Chatoptions";

import { GETALLUSERS } from "../../../api/queries/queries";
import { INSERTMSG, CREATECHATROOM, INSERTUSERCHATROOM, SUBSCRIBETONEWMSG, GETALLMSGS} from "../queries";

import "../css/chatmsgs.css";
import { chatmsgsprops, message } from "../types";
const pic = require("../../../img/unnamed.jpg");

const Chatmsgs = (chatmsgsprops: chatmsgsprops) => {
  const { 
    chatLevel, setChatLevel, 
    activeRoom, setActiveRoom, 
    createRoom, setCreateRoom, 
    handleActiveRoom, 
    setShowChatbox, 
    userId 
  } = chatmsgsprops;    
 
  const [usernameSearch, setUsernameSearch] = useState<string>("");
  const [showGroup, setShowGroup] = useState(false);
  const [chatgroupUsers, setChatgroupUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<message>({ user_id: userId!, message: "", room_id: activeRoom.roomId! });
  const [showChatoptions, setShowChatOptions] = useState<boolean>(false);
 
  const [createChatroom] = useMutation(CREATECHATROOM);
  const [insertUserChatroom] = useMutation(INSERTUSERCHATROOM);
  const [insertMessage] = useMutation(INSERTMSG);
  const [getUser, { data: allUsersData }] = useLazyQuery(GETALLUSERS);
  
  const { data: roomMsgsData, subscribeToMore: subscribeToMoreMessages } = useQuery(GETALLMSGS,{
    variables: {
      filter: {
        room_id: activeRoom.roomId!
      }
    }
  });
  
  //handlers
  const handleDefaultState = (def:boolean = true) => {
    if(!def){
      setShowChatbox(false);
    }
    setChatLevel(0);
    setChatgroupUsers([]);
    setShowGroup(false);
    setUsernameSearch("");
    setCreateRoom(false);
    setActiveRoom({ username: "", roomId: "" });
  }

  const handleNewChat = () => {
    setCreateRoom(false);
    setShowGroup(false);
    setUsernameSearch("");
    setChatLevel(1);
    setChatgroupUsers([]);
  }
  
  const handleMessageInput = (e: any) => {
    setMessage({
      ...message,
      [e.target.name]: e.target.value
    });
  }

  const foundusernames: string[] = allUsersData?.listUsers.filter((user: any ) => {
    return !chatgroupUsers.find((usr: any) => (
      usr.id === user?.id  
    )) && user?.username.startsWith(usernameSearch)
  });

   
  const handleSubmitMessage = (e: any) => {
    e.preventDefault();
    if(message.message.length > 0) {
      insertMessage({
        variables: {
          data: message
        }
      })
    }
    setMessage({
      ...message,
      message: ""
    });    
  }

  const handleCreateChatroom = () => {
    if(!createRoom) {           
      createChatroom({
        variables: {
          data: {
            room_code: `${userId}-${chatgroupUsers[0].id}`,
          }
        },
        onError: (err: any) => {          
          if(err.message.includes("Chatroom already Exist")) {
            const room_code = err.message.substring(err.message.indexOf(":"));
            handleActiveRoom({ username: usernameSearch, roomId: room_code.substring(2,)});
          };
        },
        onCompleted: (data: any) => {
          if(data) {
            const room_code = data.insertChatroom.room_code;
            insertUserChatroom({
              variables: {
                data: [ 
                  { user_id: userId, room_id: room_code },
                  { user_id: Number(chatgroupUsers[0].id), room_id: room_code }
                ]             
              }                       
            });
            handleActiveRoom({ username: usernameSearch, roomId: data.insertChatroom.room_code});           
            setChatgroupUsers([]);
            setUsernameSearch("");
          }
        }
      });          
    }
  }  
  
  const handleSelectedUsers = (user: any) => {
    if(createRoom) {
      setChatgroupUsers([ ...chatgroupUsers, { id: user.id, username: user.username }]);
    } else {
      setUsernameSearch(user.username); 
      setChatgroupUsers([{ id: user.id, username: user.username }]);
    }
  }
  
  const handleRemoveSelectedUser: (id: number) => void = (id) => {
    const tempGroupUsers = chatgroupUsers.filter((user) => (
      user.id !== id
    ));
    setChatgroupUsers(tempGroupUsers);
  }

  useEffect(() => {
    if(usernameSearch.length !== 0) { 
      getUser();
    }
  },[usernameSearch]);
 
  useEffect(() => {
    let unsubscribe = subscribeToMoreMessages({
      document: SUBSCRIBETONEWMSG,     
      variables: { filter: { room_id: activeRoom.roomId! }},
      onError: err => console.log("msg", err),
      updateQuery: (prev: any, { subscriptionData }: any ) => {
        if (!subscriptionData.data) return prev;
        const newChatMessage = subscriptionData.data.newMessage;                  
        return {
          listMessages: [ ...prev?.listMessages, ...newChatMessage ]
        }
      }
    })
    if(unsubscribe) return () => unsubscribe();
  },[subscribeToMoreMessages, activeRoom]);

  useEffect(() => {
    if(activeRoom.roomId.length !== 0) {
      setMessage({
        ...message,
        room_id: activeRoom.roomId
      })
    }
  }, [activeRoom.roomId]);

  return(
    <div className="rchatcontainer">
      <div className="chattitle"> 
        { chatLevel === 1 ? (
          createRoom ? "Create Room" : "Create Chat" 
        ) : activeRoom.roomId.length !== 0 ? (
          activeRoom.username
        ) : ( "" )}
        <div className="chattitleicnwrapper">
          { activeRoom.roomId.length !== 0 && (            
            <Chatoptions showChatoptions={ showChatoptions } setShowChatOptions={ setShowChatOptions } roomId={ activeRoom.roomId }/>
          )}
          <i className="material-icons tiny chattitleicn" onClick={ () => handleDefaultState(false) }> 
            clear 
          </i>
        </div>
      </div>
      { chatLevel === 1 ? (
        <>
          <div className="createroom">
            <Askinput placeholder={ "Search User" } onChange={ (e) => setUsernameSearch(e.target.value) } value={ usernameSearch }  />
          </div>          
          { usernameSearch.length === 0 && (
            !createRoom ? (           
              <div className="searchusernametxt">
                Patch things here, Search User by username.
              </div>
            ) : (
              <div className="searchusernametxt">
                Patch things here, Select multiple users for room.
              </div>    
            )          
          )}
          { (createRoom && chatgroupUsers.length > 0) && (
            <div className="selectedGroupUsers">
              { chatgroupUsers.map((groupUser, idx): any => (
                <div className="groupUser waves-light waves-effect" onClick={() => handleRemoveSelectedUser(groupUser.id) } key={ idx }>
                  { groupUser.username }
                </div>
              ))}
            </div>
          )}
          <div className="suggestedusername">
            { usernameSearch.length !== 0 && (
              foundusernames?.map((user : any, idx: number) => (                                
                <div className="foundedusernames waves-light waves-effect" onClick={() => handleSelectedUsers(user)} key={ idx }> 
                  <div className="foundeduserpicwrapper">
                    <img src={pic} alt="users pic" className="foundeduserpic"/>
                  </div>
                  { user.username }
                </div>
              ))
            )}
          </div>
          <div className="acceptroom">
            <div className="waves-effect waves-light red lighten-1 black-text acceptroombtn" onClick={() => handleDefaultState() }>
              cancel
            </div>
            <div className="waves-effect waves-light acceptroombtn" onClick={ handleCreateChatroom }>
              Create
            </div>
          </div>
        </> 
      ) : activeRoom?.roomId.length !== 0 ? (
        <>
          <div className="chat">
            { roomMsgsData?.listMessages.map((message: any, idx: number) => (          
              <Message txt={ message.message } id={ message.user_id.id } userId={ userId! } key={ idx }/>
            ))}
          </div>
          <form className="chatform" onSubmit={ handleSubmitMessage }> 
            <i className="material-icons"> add_a_photo </i>
            <div className="messageinput">
              <Askinput name={ "message" } placeholder={"Message"} onChange={ handleMessageInput } value={ message.message }/>
            </div>
            <i className="material-icons chatsubmit" onClick={ handleSubmitMessage }> send </i>
          </form>
        </>
      ) : (
        <div className="startnewchat">
          <div className="startnewchatpicwrapper">
            <img src={ pic } className="startnewchatpic" alt="startnew" />
          </div>
          <div className="startnewchattext"> Welcome to Chat!!! </div>
          <div className="startnewchattext1"> Start patching things here... </div>
          <div className="startnewchatbtnwrapper">                
            <div className="waves-effect waves-light startnewchatbtn" onClick={ handleNewChat }>
              start chat
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatmsgs;
