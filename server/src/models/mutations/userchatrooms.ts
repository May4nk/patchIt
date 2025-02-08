import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

// types
import {
  userchatroomtype,
  rawuserchatroomtype,
} from "../resolvers/types/userchatroomtypes.js";
import { IDSTYPE } from "../../utils/common/types.js";

export const userchatroomMutations = {
  Mutation: {
    insertUserChatroom: async (
      _: undefined,
      { data }: { data: rawuserchatroomtype[] },
      { pubsub }: any
    ): Promise<rawuserchatroomtype[]> => {
      try {
        const createUserChatroom: rawuserchatroomtype[] = await db
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
      { data }: { data: IDSTYPE }
    ): Promise<IDSTYPE> => {
      try {
        const foundUserChatroom: userchatroomtype = await findOne<
          userchatroomtype,
          IDSTYPE
        >("user_chatrooms", { id: data.id });

        if (!foundUserChatroom) throw new Error("User Chat room not found...");

        const [deleteUserChatroom]: IDSTYPE[] = await db("user_chatrooms")
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
        { userId }: { userId: string }
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
