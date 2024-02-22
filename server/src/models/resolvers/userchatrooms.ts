import db from "../../db.js";
import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { userchatroomfiltertype, userchatroomtype, userchatroomcomparetype } from "./types/userchatroomtypes.js";
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
    listSpecificUserChatrooms: async (parent: undefined, { userId }: { userId: number }): Promise<userchatroomcomparetype[]> => {

      const userRooms: userchatroomtype[] = await listAll<userchatroomtype, { user_id: number }>("user_chatrooms", { filter: {"user_id": userId}});
      const allSpecificUserChatrooms: userchatroomcomparetype[] = await db("user_chatrooms")
        .select("*")
        .havingIn("room_id", userRooms.map(({ room_id }) => room_id))
        .groupBy("id");

      const allUserChatrooms: userchatroomcomparetype[] = allSpecificUserChatrooms.filter((chatrooms: userchatroomcomparetype) => chatrooms.user_id !== userId);     
      
      return allUserChatrooms;

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
    users: async({ room_id }: { room_id: string }): Promise<userchatroomtype[]> => {
      const userRooms: userchatroomtype[] = await listAll<userchatroomtype, { room_id: string }>("user_chatrooms", {filter: {"room_id": room_id}});
      return userRooms;
    }
  }
}

