import client from "../../client";

//queries
import {
  CHECKROOMEXISTS,
  CREATECHATROOM,
  INSERTUSERCHATROOM,
  UPSERTCHATROOMPREFERENCE,
} from "../../components/chatbox/queries";

//types
import { RESPONSETYPE } from "../main/types";
import {
  createchatroomroomtype,
  createchatroomtype,
  upsertchatpreferencestype,
} from "../types";
import {
  // activeroomtype,
  chatboxstateactiontype,
  chatboxstatetype,
  chatgroupusertype,
  handlechatboxstateactiontype,
  roomtype,
} from "../../components/chatbox/types";

export const upsertChatPrefrences: upsertchatpreferencestype = async (
  ownerId: string,
  roomId: string
) => {
  try {
    await client.mutate({
      mutation: UPSERTCHATROOMPREFERENCE,
      variables: {
        data: {
          owner: ownerId,
          room: roomId,
        },
      },
    });
  } catch (err) {
    throw Error("Something went wrong while creating chatpreferences");
  }
};

export const checkChatroomExists: (
  roomName: string
) => Promise<RESPONSETYPE> = async (roomName: string) => {
  try {
    const { data } = await client.mutate({
      mutation: CHECKROOMEXISTS,
      variables: {
        data: { roomName },
      },
    });

    if (data?.checkRoomExists) {
      return { status: 0, message: "Chatroom already exists" };
    }

    return { status: 404, message: `No Chatroom found with ${roomName}` };
  } catch (err) {
    return {
      status: 500,
      message: `Something went wrong: Chatroom verification failed`,
    };
  }
};

export const createNewChatroom: createchatroomtype = async (
  room: createchatroomroomtype
) => {
  const { ownerId, roomName, chatgroupUsers } = room;

  try {
    const isChatroomExists = await checkChatroomExists(roomName);

    if (isChatroomExists.status !== 0) {
      const { data } = await client.mutate({
        mutation: CREATECHATROOM,
        variables: {
          data: {
            owner: ownerId,
            roomName: roomName,
          },
        },
      });

      if (data) {
        const chatroom: roomtype = data?.upsertChatroom;
        const roomId: string = chatroom.id;

        const roomUsers: { user_id: string; room_id: string }[] =
          chatgroupUsers.map((user: chatgroupusertype) => ({
            user_id: user.id,
            room_id: roomId,
          }));

        await client.mutate({
          mutation: INSERTUSERCHATROOM,
          variables: {
            data: [
              {
                user_id: ownerId,
                room_id: roomId,
              },
              ...roomUsers,
            ],
          },
        });

        const newRoomId: string = roomId;

        return { status: 200, roomId: newRoomId, message: "Chatroom is ready" };
      }
    } else {
      return {
        status: 0,
        roomId: null,
        message: "Chatroom already exists",
      };
    }

    return { status: 500, roomId: null, message: "Chatroom creation failed" };
  } catch (err) {
    throw err;
  }
};

//chatbox states
export const chatBoxInitState: chatboxstatetype = {
  level: 100,
  createRoom: false,
  searchUsername: "",
  name: "",
  roomUsers: [],
  activeRoomId: "",
  error: { show: false, status: 0, message: "" },
  roomInfo: {
    users: [],
    ownerId: "",
    theme: "",
    about: "",
    blockedUsers: [],
    name: "",
    isRoom: false,
    profile_pic: "",
    allowedMedia: "ALL",
    admin: "",
    co_admin: "",
    operator: "",
    acceptor: "",
  },
};

export const handleChatBoxState: handlechatboxstateactiontype = (
  state: chatboxstatetype,
  action: chatboxstateactiontype
) => {
  switch (action.type) {
    case "SET_LEVEL":
      return { ...state, level: action.level };

    case "SET_ROOM_NAME":
      return { ...state, name: action.name };

    case "ADD_ROOM_USER":
      return { ...state, roomUsers: [...state.roomUsers, action.user] };

    case "SEARCH_USERNAME":
      return { ...state, searchUsername: action.username };

    case "DEL_ROOM_USER":
      return {
        ...state,
        roomUsers: state.roomUsers.filter(
          (user: chatgroupusertype) => user.id !== action.userId
        ),
      };

    case "SET_ACTIVE_ROOMINFO":
      return {
        ...state,
        roomInfo: {
          ...state.roomInfo,
          ...action.info,
        },
      };

    case "SET_ACTIVE_ROOMID":
      return {
        ...chatBoxInitState,
        level: 0,
        activeRoomId: action.roomId,
      };

    case "NEW_CHAT":
      return {
        ...chatBoxInitState,
        level: 101,
        createRoom: action.isRoom,
      };

    case "RESET_ROOM_USERS":
      return { ...state, roomUsers: [] };

    case "SOFT_RESET":
      return state;

    case "RESET":
      return chatBoxInitState;

    case "SET_ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
};
