import db from "../../db.js";
import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { userchatroomfiltertype, userchatroomtype, rawuserchatroomtype } from "./types/userchatroomtypes.js";
import { usertype } from "./types/usertypes.js";
import { chatroomtype } from "./types/chatroomtypes.js";

export const userchatroomResolvers = {
  Query: {
    listUserChatrooms: async (parent: undefined, filter: filtersorttype<userchatroomfiltertype>) => {
      try { 
        const allUserChatrooms: userchatroomtype[] = await listAll<userchatroomtype, userchatroomfiltertype>("user_chatrooms", filter);
        return allUserChatrooms;
      } catch(err) {
        throw err;
      }
    },
    userChatroom: async (parent: undefined, { roomId }: { roomId: string }): Promise<userchatroomtype> => {
      try {
        const userRoomById: userchatroomtype = await findOne<userchatroomtype, { room_id: string }>("user_chatrooms", { "room_id": roomId });

        if(!userRoomById) throw new Error(`Message not found with id: ${ roomId }`);

        return userRoomById;
      } catch(err) {
        throw err;
     }
    },
  },
  UserChatroom: {
    user_id: async({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { "id": user_id });
        return userById;
      } catch(err) {
        throw err;
     }
    },
    room_id: async({ room_id }: { room_id: string }): Promise<chatroomtype> => {
      try {
        const roomById: chatroomtype = await findOne<chatroomtype, { room_code: string }>("chatrooms", { "room_code": room_id });
        return roomById;
      } catch(err) {
        throw err;
     }
    },
    users: async({ room_id }: { room_id: string }): Promise<usertype[]> => {
      const userRooms: rawuserchatroomtype[] = await listAll<rawuserchatroomtype, { room_id: string }>("user_chatrooms", { filter: {"room_id": room_id }});

      const chatroomUsers: usertype[] = await Promise.all(userRooms.map(async (room: rawuserchatroomtype) => {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { "id": room.user_id });
        return userById
      }));
      
      return chatroomUsers;
    }
  }
}

