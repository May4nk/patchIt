import db from "../../db.js";
import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype, IDSTYPE } from "../../utils/common/types.js";
import { chatpreferencetype } from "./types/chatpreferencetypes.js";
import { chatroomfiltertype, chatroomtype } from "./types/chatroomtypes.js";

export const chatroomResolvers = {
  Query: {
    listChatrooms: async (
      _: undefined,
      filter: filtersorttype<chatroomfiltertype>
    ): Promise<chatroomtype[]> => {
      try {
        const allChatrooms: chatroomtype[] = await listAll<
          chatroomtype,
          chatroomfiltertype
        >("chatrooms", filter);

        return allChatrooms;
      } catch (err) {
        throw err;
      }
    },
    chatroom: async (
      _: undefined,
      { chatroomId }: { chatroomId: string }
    ): Promise<chatroomtype> => {
      try {
        const chatroomById: chatroomtype = await findOne<
          chatroomtype,
          { id: string }
        >("chatrooms", { id: chatroomId });

        if (!chatroomById)
          throw new Error(`Chatroom not found with id: ${chatroomId}`);

        return chatroomById;
      } catch (err) {
        throw err;
      }
    },
  },
  Chatroom: {
    owner: async ({ owner }: { owner: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: string }>(
          "users",
          { id: owner }
        );

        return userById;
      } catch (err) {
        throw err;
      }
    },
    roomUsers: async ({ id }: IDSTYPE): Promise<usertype[]> => {
      try {
        const allChatRoomUsers: usertype[] = await db("user_chatrooms")
          .rightJoin("users", "user_chatrooms.user_id", "=", "users.id")
          .select("users.*")
          .where("user_chatrooms.room_id", id);

        return allChatRoomUsers;
      } catch (err) {
        throw err;
      }
    },
    chatPreferences: async ({
      id,
    }: IDSTYPE): Promise<chatpreferencetype | null> => {
      try {
        const chatroomPreferences: chatpreferencetype = await findOne<
          chatpreferencetype,
          { room: string }
        >("chat_preferences", { room: id });

        if (!chatroomPreferences) {
          return null;
        }

        return chatroomPreferences;
      } catch (err) {
        throw err;
      }
    },
  },
};
