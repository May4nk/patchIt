import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import EmojiPicker, { Theme } from "emoji-picker-react";

import { changeToBase64 } from '../../../utils/opx';

//components
import Message from './Message';
import Askinput from '../../html/Askinput';

//queries
import { GETALLMSGS, INSERTMSG, SUBSCRIBETONEWMSG } from '../queries';

//css, types & constants
import "../css/chat.css";
import { emojisCategory } from '../../../constants/const';
import { messagetype, messagestatetype, chatpropstype, messagetexttype, listmessagestype } from '../types';

function Chat(chatpropstype: chatpropstype) {
  const { userId, activeRoom, setError } = chatpropstype;

  const emojiRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLInputElement | null>(null);

  //states
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [showMedia, setShowMedia] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<messagetexttype>({ txt: "", media: [] });
  const [message, setMessage] = useState<messagestatetype>({
    user_id: userId!,
    message: "",
    room_id: activeRoom.roomId!,
    media: false
  });

  //queries
  const [insertMessage] = useMutation(INSERTMSG);
  const { data, subscribeToMore: subscribeToMoreMessages } = useQuery(GETALLMSGS, {
    variables: {
      filter: {
        room_id: activeRoom.roomId!
      }
    }
  });

  //handlers
  const closeEmoji = (e: any) => {
    if (emojiRef.current && showEmoji && !emojiRef.current.contains(e.target)) {
      setShowEmoji(false)
    }
  }

  document.addEventListener('mousedown', closeEmoji);

  const handleEmoji: ({ emoji }: { emoji: string }) => void = ({ emoji }: { emoji: string }) => {
    setMessageText({
      ...messageText,
      txt: `${messageText.txt} ${emoji}`
    })
  };

  const handleMedia: () => Promise<void> = async () => {
    try {
      if (mediaRef?.current && mediaRef?.current?.files) {
        const picBlob: Blob = mediaRef?.current?.files[0];
        if (picBlob) {
          const pic = await changeToBase64(picBlob);
          if (pic) {
            setMessageText({ ...messageText, media: [...messageText.media, pic] });
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload pic";
      setError({ status: 500, message: errorMessage, show: true })
    }
  }

  const handleSubmitMessage: (e: any) => Promise<void> = async (e: any) => {
    e.preventDefault();

    try {
      if (messageText.txt.length > 0 || messageText.media.length > 0) {
        await insertMessage({
          variables: {
            data: {
              ...message,
              message: JSON.stringify(messageText)
            }
          },
        })
      }

      setMessage({
        ...message,
        media: false
      });

      setMessageText({ txt: "", media: [] });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong: Message sending failed";
      setError({ status: 500, message: errorMessage, show: true });
    }
  }

  useEffect(() => {
    if (activeRoom.roomId.length !== 0) {
      setMessage({
        ...message,
        room_id: activeRoom.roomId,
        user_id: userId!
      })
    }
  }, [activeRoom]);

  useEffect(() => {
    let unsubscribe = subscribeToMoreMessages({
      document: SUBSCRIBETONEWMSG,
      variables: { filter: { room_id: activeRoom.roomId! } },
      onError: err => console.log("msg", err),
      updateQuery: (
        { listMessages }: { listMessages: listmessagestype[] },
        { subscriptionData }: { subscriptionData: { data: { newMessage: listmessagestype[] } } }
      ) => {
        if (!subscriptionData.data) return listMessages;
        const newChatMessage = subscriptionData.data.newMessage;
        return {
          listMessages: [...listMessages, ...newChatMessage]
        }
      }
    })

    if (unsubscribe) return () => unsubscribe();

  }, [subscribeToMoreMessages, activeRoom]);

  useEffect(() => {
    if (messageText.media.length > 0) {
      setMessage({
        ...message,
        media: true
      })
    } else {
      setMessage({
        ...message,
        media: false
      })
    }
  }, [messageText.media]);

  return (
    <>
      <div className="chat">
        {data?.listMessages.map((message: messagetype, idx: number) => (
          <Message
            key={idx}
            userId={userId!}
            messageInfo={message}
            activeRoom={activeRoom}
            userInfo={message.user_id}
          />
        ))}
      </div>
      {messageText.media.length > 0 && (
        <div className="chatpicswrapper">
          <div className="chatpicsactions">
            <i
              className="material-icons chatpicaction"
              onClick={() => setShowMedia(!showMedia)
              }>
              {showMedia ? "arrow_drop_down" : "collections_bookmark"}
            </i>
            <i
              className="material-icons chatpicactiondelete right"
              onClick={() => setMessageText({ ...messageText, media: [] })}
            >
              clear
            </i>
          </div>
          {showMedia && (
            <div className="chatpics">
              {messageText.media.map((pic: string, idx: number) => (
                <div className="chatpicwrapper" key={idx}>
                  <img
                    src={pic}
                    alt="pic"
                    className="chatpic"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <form className="chatform" onSubmit={handleSubmitMessage}>
        <div className="chaticns">
          <label htmlFor="img">
            <i className="material-icons chaticn"> add_a_photo </i>
          </label>
          <input
            id="img"
            type="file"
            name="message"
            accept="image/*"
            ref={mediaRef}
            onChange={handleMedia}
          />
          <i className="material-icons chaticn" onClick={() => setShowEmoji(!showEmoji)}>
            insert_emoticon
          </i>
          {showEmoji && (
            <div className="emojis" ref={emojiRef}>
              <EmojiPicker
                width={"15rem"}
                height={"23rem"}
                theme={Theme.DARK}
                onEmojiClick={handleEmoji}
                categories={emojisCategory}
                searchDisabled
              />
            </div>
          )}
        </div>
        <div className="messageinput">
          <Askinput
            name={"message"}
            value={messageText.txt}
            placeholder={"Message"}
            onChange={(e) => setMessageText({ ...messageText, txt: e.target.value })}
          />
        </div>
        <i className="material-icons chaticn" onClick={handleSubmitMessage}> send </i>
      </form>
    </>
  )
}

export default Chat;