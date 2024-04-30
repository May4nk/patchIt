import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import {chatroomdatatype, remchatroomdatatype, rchatroomtype } from "./types/chatroommutetypes.js";
import { ruserchatroomtype } from "./types/userchatroommutetypes.js";
import { chatroomtype } from "../resolvers/types/chatroomtypes.js";

export const chatroomMutations = {
  Mutation: {
    insertChatroom: async (
      parent: undefined,
      { data }: chatroomdatatype,
      { pubsub }: any
    ): Promise<chatroomtype> => {
      try {
        const revRoomCode: string = data.room_code
          .split("-")
          .reverse()
          .join("-");
        const foundChatroom: chatroomtype = await db("chatrooms")
          .where("room_code", data.room_code)
          .orWhere("room_code", revRoomCode)
          .first();

        if (!foundChatroom) {
          const [createChatroom]: chatroomtype[] = await db("chatrooms")
            .insert(data)
            .returning("*");

          return createChatroom;
        } else if (foundChatroom && foundChatroom.status === "INACTIVE") {
          const [updateChatroom]: chatroomtype[] = await db("chatrooms")
            .where("room_code", foundChatroom.room_code)
            .update({ status: "ACTIVE" })
            .returning("*");

          return updateChatroom;
        } else {
          throw new Error(
            `Chatroom already Exist id: ${foundChatroom.room_code}`
          );
        }
      } catch (err) {
        throw err;
      }
    },
    softDeleteChatroom: async (
      parent: undefined,
      { data }: chatroomdatatype,
      { pubsub }: any
    ): Promise<chatroomtype> => {
      try {
        const foundChatroom: chatroomtype = await findOne<
          chatroomtype,
          { room_code: string }
        >("chatrooms", { room_code: data.room_code });
        if (!foundChatroom)
          throw new Error(`Chatroom not found id: ${data.room_code}`);

        const [delChatroom]: chatroomtype[] = await db("chatrooms")
          .where("room_code", foundChatroom.room_code)
          .update({ status: "INACTIVE" })
          .returning("*");

        const [delUserChatroom]: ruserchatroomtype[] = await db(
          "user_chatrooms"
        )
          .where("room_id", foundChatroom.room_code)
          .del()
          .returning("id");

        return delChatroom;
      } catch (err) {
        throw err;
      }
    },
    removeChatroom: async (
      parent: undefined,
      { data }: remchatroomdatatype
    ): Promise<rchatroomtype> => {
      try {
        const foundChatroom: chatroomtype = await findOne("chatrooms", {
          id: data.id,
        });

        if (!foundChatroom) throw new Error("Chatroom not found.");

        const [deleteChatroom]: chatroomtype[] = await db("chatrooms")
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
