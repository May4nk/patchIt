import { Reducer } from "react";
import client from "../client";

//queries
import {
  CREATECHATROOM,
  GETUSERCHATROOMS,
  INSERTUSERCHATROOM,
  UPSERTCHATROOMPREFERENCE,
} from "../components/chatbox/queries";

//types
import { RESPONSETYPE } from "./main/types";
import {
  ACTION,
  chatroominfotype,
  createchatroomtype,
  upsertchatpreferencestype,
} from "./types";
import {
  activeroomtype,
  chatgroupusertype,
  roomtype,
} from "../components/chatbox/types";

export const upsertChatPrefrences: upsertchatpreferencestype = async (
  ownerId: number,
  room_code: string
) => {
  try {
    await client.mutate({
      mutation: UPSERTCHATROOMPREFERENCE,
      variables: {
        data: {
          owner: ownerId,
          room: room_code,
        },
      },
    });
  } catch (err) {
    throw Error("Something went wrong while creating chatpreferences");
  }
};

export const checkChatroomExists: (
  roomId: number[]
) => Promise<RESPONSETYPE> = async (roomId: number[]) => {
  try {
    const roomCode = `room-${btoa(JSON.stringify(roomId))}`;
    const revRoomCode = `room-${btoa(JSON.stringify(roomId.reverse()))}`;
    const { data } = await client.query({
      query: GETUSERCHATROOMS,
      variables: {
        data: {
          filter: {
            room_id: [roomCode, revRoomCode],
          }
        },
      },
    });

    if (data?.listUserChatrooms?.length > 0) {
      return { status: 0, message: "Chatroom already exists" };
    }

    return { status: 404, message: `No Chatroom found with ${roomId[0]}` };
  } catch (err) {
    return {
      status: 500,
      message: `Something went wrong: Chatroom verification failed`,
    };
  }
};

export const createNewChatroom: createchatroomtype = async (
  roomCode: string,
  ownerId: number,
  chatgroupUsers: chatgroupusertype[],
  roomName: string = ""
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATECHATROOM,
      variables: {
        data: {
          room_code: roomCode,
          owner: ownerId,
          roomName: roomName,
        },
      },
    });

    if (data?.insertChatroom) {
      const insertChatroom: roomtype = data?.insertChatroom;
      const room_code: string = insertChatroom.room_code;

      const roomUsers: { user_id: number; room_id: string }[] =
        chatgroupUsers.map((user: chatgroupusertype) => ({
          user_id: user.id,
          room_id: room_code,
        }));

      await client.mutate({
        mutation: INSERTUSERCHATROOM,
        variables: {
          data: [
            {
              user_id: ownerId,
              room_id: room_code,
            },
            ...roomUsers,
          ],
        },
      });

      const newRoom: activeroomtype = {
        roomId: insertChatroom?.room_code,
        users: chatgroupUsers.length,
      };

      return { status: 200, room: newRoom, message: "Chatroom is ready" };
    }

    return { status: 500, room: null, message: "Chatroom creation failed" };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message && err.message.includes("Chatroom already Exist")) {
        const room_code = err.message
          .substring(err.message.indexOf(":") + 1)
          .trim();
        const alreadyRoom: activeroomtype = {
          roomId: room_code,
          users: 0,
        };

        return {
          status: 0,
          room: alreadyRoom,
          message: "Chatroom already exists",
        };
      }
    }
    throw err;
  }
};

export const initialChatroomInfo: chatroominfotype = {
  users: [],
  ownerId: 0,
  theme: "",
  about: "",
  blocked: [],
  room_code: "",
  roomName: "",
  isRoom: false,
  profile_pic: "",
  allowedMedia: "ALL",
  admin: "",
  co_admin: "",
  operator: "",
  acceptor: "",
};

export const chatInfoReducer: Reducer<chatroominfotype, ACTION> = (
  state,
  action
) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
