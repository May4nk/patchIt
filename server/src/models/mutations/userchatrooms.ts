import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { userchatroomdatatype, remuserchatroomdatatype, ruserchatroomtype } from "./types/userchatroommutetypes.js";
import { userchatroomtype } from "../resolvers/types/userchatroomtypes.js";

export const userchatroomMutations = {
  Mutation: {
    insertUserChatroom: async(parent: undefined, { data }: userchatroomdatatype, { pubsub }: any ): Promise<userchatroomtype[]> => {
      try {
        const createUserChatroom: userchatroomtype[] = await db.batchInsert("user_chatrooms", data)      
          .returning("*");       
        
        pubsub.publish("NEWUSERCHATROOM", createUserChatroom);

        return createUserChatroom;                
      } catch(err) {
        throw err;
      }
    },
    removeUserChatroom: async(parent: undefined, { data }: remuserchatroomdatatype): Promise<ruserchatroomtype> => {
      try {
        const foundUserChatroom: userchatroomtype = await findOne<userchatroomtype, { id: number }>("user_chatrooms", { "id": data.id });
        
        if(!foundUserChatroom) throw new Error("User Chat room not found...");
        
        const [deleteUserChatroom]: ruserchatroomtype[] = await db("user_chatrooms")
          .where("id", foundUserChatroom.id)
          .del()
          .returning("id");       

        return deleteUserChatroom;
      } catch(err) {
        throw err;
      }
    }
  },
  Subscription: {
    newUserChatroom : {
      subscribe: async(parent: undefined, args: undefined, { pubsub }: any) => {
        return pubsub.asyncIterator('NEWUSERCHATROOM');
      },
      resolve: (payload: userchatroomtype[], { userId }: { userId: number }) => {
        const re: userchatroomtype[] = payload.filter((load: any) => load.user_id !== +userId);
        return re;
      }
    }
  }    
}
