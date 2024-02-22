import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { chatroomfiltertype, chatroomtype } from "./types/chatroomtypes.js";

export const chatroomResolvers = {
  Query: {
    listChatrooms: async (parent: undefined, filter: filtersorttype<chatroomfiltertype>): Promise<chatroomtype[]> => {
      try { 
        const allChatrooms: chatroomtype[] = await listAll<chatroomtype, chatroomfiltertype>("chatrooms", filter);
        return allChatrooms;
      } catch(err) {
        throw err;
      }
    },
    chatroom: async (parent: undefined, { id }: { id: number }): Promise<chatroomtype> => {
      try {
        const chatroomById: chatroomtype = await findOne<chatroomtype, { id: number }>("chatrooms", { "id": id });

        if(!chatroomById) throw new Error(`Chatroom not found with id: ${ id }`);

        return chatroomById;
      } catch(err) {
        throw err;
     }
    },
  },
}

