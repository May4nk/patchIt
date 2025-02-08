import db from "../../db.js";
import { revRoomCode } from "../../utils/chatroomopx.js";
import { findOne, listAll } from "../../utils/common/queriesutils.js";

//types
import {
  chatroomtype,
  chatroommutetype,
  chatroomexisttype,
} from "../resolvers/types/chatroomtypes.js";
import { IDSTYPE } from "../../utils/common/types.js";

export const chatroomMutations = {
  Mutation: {
    upsertChatroom: async (
      _: undefined,
      { data }: { data: chatroommutetype }
    ): Promise<chatroommutetype> => {
      try {
        if (data?.id) {
          const foundChatroom: chatroomtype = await findOne<
            chatroomtype,
            IDSTYPE
          >("chatrooms", { id: data?.id });

          if (!foundChatroom) {
            throw Error(`Chatroom don't exist with id: ${data?.id}`);
          }

          const [updateChatroom]: chatroommutetype[] = await db("chatrooms")
            .update(data)
            .where("id", foundChatroom.id)
            .returning("*");

          return updateChatroom;
        }

        const [createChatroom]: chatroommutetype[] = await db("chatrooms")
          .insert(data)
          .returning("*");

        return createChatroom;
      } catch (err) {
        throw err;
      }
    },
    checkRoomExists: async (
      _: undefined,
      { data }: { data: chatroomexisttype }
    ): Promise<boolean> => {
      try {
        const room = revRoomCode(data?.roomName);

        const isRoomExists: chatroomtype[] = await listAll<
          chatroomtype,
          { roomName: string[] }
        >("chatrooms", { filter: { roomName: [data?.roomName, room.code] } });

        if (isRoomExists?.length > 0) {
          return true;
        }

        return false;
      } catch (err) {
        throw err;
      }
    },
    softDeleteChatroom: async (
      _: undefined,
      { data }: { data: chatroommutetype }
    ): Promise<chatroomtype> => {
      try {
        const foundChatroom: chatroomtype = await findOne<
          chatroomtype,
          IDSTYPE
        >("chatrooms", { id: data.id });

        if (!foundChatroom) {
          throw new Error(`Chatroom not found with id: ${data.id}`);
        }

        const [delChatroom]: chatroomtype[] = await db("chatrooms")
          .where("id", foundChatroom.id)
          .update({ status: "INACTIVE" })
          .returning("*");

        const [delUserChatroom]: IDSTYPE[] = await db("user_chatrooms")
          .where("room_id", foundChatroom.id)
          .del()
          .returning("id");

        return delChatroom;
      } catch (err) {
        throw err;
      }
    },
    removeChatroom: async (
      _: undefined,
      { data }: { data: IDSTYPE }
    ): Promise<IDSTYPE> => {
      try {
        const foundChatroom: chatroomtype = await findOne<
          chatroomtype,
          IDSTYPE
        >("chatrooms", { id: data.id });

        if (!foundChatroom) throw new Error("Chatroom not found.");

        const [deleteChatroom]: IDSTYPE[] = await db("chatrooms")
          .where("id", foundChatroom.id)
          .del()
          .returning("id");

        return deleteChatroom;
      } catch (err) {
        throw err;
      }
    },
  },
};
