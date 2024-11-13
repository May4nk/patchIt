import db from "../../db.js";
import { revRoomCode } from "../../utils/chatroomopx.js";
import { findOne, listAll } from "../../utils/queriesutils.js";

//types
import { chatroomtype } from "../resolvers/types/chatroomtypes.js";
import { ruserchatroomtype } from "./types/userchatroommutetypes.js";
import { userchatroomtype } from "../resolvers/types/userchatroomtypes.js";
import {
  chatroomdatatype,
  remchatroomdatatype,
  rchatroomtype,
} from "./types/chatroommutetypes.js";

export const chatroomMutations = {
  Mutation: {
    insertChatroom: async (
      _: undefined,
      { data }: chatroomdatatype
    ): Promise<chatroomtype> => {
      try {
        const room = revRoomCode(data?.room_code);

        if (!room.isRoom) {
          const isRoomExists: userchatroomtype[] = await listAll<
            userchatroomtype,
            { room_id: string[] }
          >("user_chatrooms", {
            filter: { room_id: [data?.room_code, room.code] },
          });

          if (isRoomExists?.length > 0) {
            throw new Error(`Chatroom already Exist`);
          }
        }

        const [createChatroom]: chatroomtype[] = await db("chatrooms")
          .insert(data)
          .returning("*");

        return createChatroom;
      } catch (err) {
        throw err;
      }
    },
    softDeleteChatroom: async (
      _: undefined,
      { data }: chatroomdatatype
    ): Promise<chatroomtype> => {
      try {
        const foundChatroom: chatroomtype = await findOne<
          chatroomtype,
          { room_code: string }
        >("chatrooms", { room_code: data.room_code });

        if (!foundChatroom) {
          throw new Error(`Chatroom not found id: ${data.room_code}`);
        }

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
      _: undefined,
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
