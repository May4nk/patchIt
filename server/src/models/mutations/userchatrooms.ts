import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

// types
import { userchatroomtype } from "../resolvers/types/userchatroomtypes.js";
import {
  remuserchatroomdatatype,
  userchatroomdatatype,
  rawuserchatroomtype,
  ruserchatroomtype,
} from "./types/userchatroommutetypes.js";

export const userchatroomMutations = {
  Mutation: {
    insertUserChatroom: async (
      _: undefined,
      { data }: userchatroomdatatype,
      { pubsub }: any
    ): Promise<userchatroomtype[]> => {
      try {
        const createUserChatroom: userchatroomtype[] = await db
          .batchInsert("user_chatrooms", data)
          .returning("*");

        pubsub.publish("NEWUSERCHATROOM", createUserChatroom);

        return createUserChatroom;
      } catch (err) {
        throw err;
      }
    },
    removeUserChatroom: async (
      _: undefined,
      { data }: remuserchatroomdatatype
    ): Promise<ruserchatroomtype> => {
      try {
        const foundUserChatroom: userchatroomtype = await findOne<
          userchatroomtype,
          { id: number }
        >("user_chatrooms", { id: data.id });

        if (!foundUserChatroom) throw new Error("User Chat room not found...");

        const [deleteUserChatroom]: ruserchatroomtype[] = await db(
          "user_chatrooms"
        )
          .where("id", foundUserChatroom.id)
          .del()
          .returning("id");

        return deleteUserChatroom;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newUserChatroom: {
      subscribe: (_: undefined, args: undefined, { pubsub }: any) => {
        return pubsub.asyncIterator("NEWUSERCHATROOM");
      },
      resolve: (
        payload: rawuserchatroomtype[],
        { userId }: { userId: number }
      ) => {
        const chatroomUsers = payload.filter(
          (chatroom: rawuserchatroomtype) => chatroom.user_id === userId
        );

        if (chatroomUsers.length === 0) {
          return null;
        }

        return chatroomUsers[0];
      },
    },
  },
};
