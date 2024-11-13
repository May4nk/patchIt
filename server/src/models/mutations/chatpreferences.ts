import db from "../../db.js";

//utils
import { findOne } from "../../utils/queriesutils.js";

//types
import {
  chatpreferencedatatype,
  remchatpreferencedatatype,
  rchatpreferencetype,
  chatpreferencetype,
} from "./types/chatpreferencemutetypes.js";
import { usertype } from "../resolvers/types/usertypes.js";

export const chatpreferenceMutations = {
  Mutation: {
    upsertChatPreference: async (
      _: undefined,
      { data }: chatpreferencedatatype,
      { user }: { user: usertype }
    ): Promise<chatpreferencetype> => {
      if (!user) throw Error("User not authorized");

      try {
        const chatPreferenceFound: chatpreferencetype = await findOne<
          chatpreferencetype,
          { owner: number; room: string }
        >("chat_preferences", { owner: data.owner, room: data.room });

        if (chatPreferenceFound) {
          const [updateChatPreference]: chatpreferencetype[] = await db(
            "chat_preferences"
          )
            .where("owner", chatPreferenceFound.owner)
            .andWhere("room", chatPreferenceFound.room)
            .update(data)
            .returning("*");

          return updateChatPreference;
        }

        const [createChatPreference]: chatpreferencetype[] = await db(
          "chat_preferences"
        )
          .insert(data)
          .returning("*");

        return createChatPreference;
      } catch (err) {
        throw err;
      }
    },
    removeChatPreference: async (
      _: undefined,
      { data }: remchatpreferencedatatype,
      { user }: { user: usertype }
    ): Promise<rchatpreferencetype> => {
      try {
        if (!user) throw Error("User not authorized");

        const chatPreferenceFound: chatpreferencetype = await findOne<
          chatpreferencetype,
          { owner: number; room: string }
        >("chat_preferences", { owner: user.id, room: data.room });

        if (!chatPreferenceFound)
          throw Error("Chat not found with settings...");

        const [deleteChatPreference]: rchatpreferencetype[] = await db(
          "chat_preferences"
        )
          .where("id", chatPreferenceFound.id)
          .del()
          .returning("id");

        return deleteChatPreference;
      } catch (err) {
        throw err;
      }
    },
  },
};
