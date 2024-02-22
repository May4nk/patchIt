import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { messagetype, messagefiltertype } from "./types/messagetypes.js";
import { usertype } from "./types/usertypes.js";
import { chatroomtype } from "./types/chatroomtypes.js";


export const messageResolvers = {
  Query: {
    listMessages: async (parent: undefined, filter?: filtersorttype<messagefiltertype> ): Promise<messagetype[]> => {
      try {
        const allMessages: messagetype[] = await listAll<messagetype, messagefiltertype>("chat", filter );
        return allMessages;
      } catch(err) {
        throw err;
      }
    },
    message: async (parent: undefined, { id }: { id: number }): Promise<messagetype> => {
      try {
        const messageById: messagetype = await findOne<messagetype, { id: number }>("chat", { "id": id });

        if(!messageById) throw new Error(`Message not found with id: ${ id }`);

        return messageById;
      } catch(err) {
        throw err;
      }
    },
  },
  Message: {
    user_id: async({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { "id": user_id });
        return userById;
      } catch (err) {
        throw err;
      }
    },
    room_id: async({ room_id }: { room_id: string }): Promise<chatroomtype> => {
      try {
        const roomByCode: chatroomtype = await findOne<chatroomtype, { room_code: string }>("chatrooms", { "room_code": room_id });
        return roomByCode;
      } catch (err) {
        throw err;
      }
    }
  },
}

