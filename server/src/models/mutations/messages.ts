import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { messagetype } from "../resolvers/types/messagetypes.js";
import { getProducer, getConsumer } from "../../services/kafka.js";
type rmessagetype = { id: number };

export const messageMutations = {
  Mutation: {
    insertMessage: async (_: undefined, { data }: { data: messagetype }, { pubsub }: any) => {

      const topic: string = "NEW-MESSAGE";
      const group: string = "test-group";

      await getProducer<messagetype>(topic, data);
      
      await getConsumer<messagetype>(topic, group, (async (data: messagetype) => {
        const [createChat]: messagetype[] = await db("chat")
        .insert(data)
        .returning("*");
    
        pubsub.publish("NEW_MESSAGE", createChat);
        return createChat;
      }));
    },
    removeMessage: async (_: undefined, { data }: { data: rmessagetype }): Promise<rmessagetype> => {
      try {
        const foundMessage: messagetype = await findOne<
          messagetype,
          { id: number }
        >("chat", { id: data.id });

        if (!foundMessage) throw new Error("Messages not found...");

        const [deleteMessage]: rmessagetype[] = await db("chat")
          .where("id", foundMessage.id)
          .del()
          .returning("id");

        return deleteMessage;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: (parent: undefined, args: undefined, { pubsub }: any) => {
        return pubsub.asyncIterator(["NEW_MESSAGE"]);
      },
      resolve: (payload: messagetype) => {
        return [payload];
      },
    },
  },
};
