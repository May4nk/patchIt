import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { messagedatatype, remmessagedatatype, rmessagetype } from "./types/messagemutetypes.js";
import { messagetype } from "../resolvers/types/messagetypes.js";

export const messageMutations = {
  Mutation: {
    insertMessage: async(parent: undefined, { data }: messagedatatype, { pubsub }: any): Promise<messagetype> => {
      try {
        const [createChat]: messagetype[] = await db("chat")
          .insert(data)
          .returning("*");
        
        pubsub.publish("NEW_MESSAGE", createChat);

        return createChat;        
        
      } catch(err) {
        throw err;
      }
    },
    removeMessage: async(parent: undefined, { data }: remmessagedatatype): Promise<rmessagetype> => {
      try {
        const foundMessage: messagetype = await findOne<messagetype, { id: number }>("chat", { "id": data.id });
        
        if(!foundMessage) throw new Error("Messages not found...");
        
        const [deleteMessage]: rmessagetype[] = await db("chat")
          .where("id", foundMessage.id)
          .del()
          .returning("id");
        
        return deleteMessage;
      } catch(err) {
        throw err;
      }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: (parent: undefined, args: undefined, { pubsub }: any) => {
        return pubsub.asyncIterator(['NEW_MESSAGE']);
      },
      resolve: (payload: any) => {
        return [payload];
      },      
    }
  }
}
