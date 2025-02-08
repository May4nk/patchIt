import db from "../../db.js";

//utils
import { findOne } from "../../utils/common/queriesutils.js";

//types
import {
  chatpreferencetype,
  rawchatpreferencetype,
} from "../resolvers/types/chatpreferencetypes.js";
import { loggedusertype } from "../../utils/common/types.js";

export const chatpreferenceMutations = {
  Mutation: {
    upsertChatPreference: async (
      _: undefined,
      { data }: { data: rawchatpreferencetype },
      { user }: { user: loggedusertype }
    ): Promise<rawchatpreferencetype> => {
      if (!user) throw Error("User not authorized");

      try {
        const chatPreferenceFound: chatpreferencetype = await findOne<
          chatpreferencetype,
          { owner: string; room: string }
        >("chat_preferences", { owner: data.owner, room: data.room });

        if (chatPreferenceFound) {
          const [updateChatPreference]: rawchatpreferencetype[] = await db(
            "chat_preferences"
          )
            .where("owner", chatPreferenceFound.owner)
            .andWhere("room", chatPreferenceFound.room)
            .update(data)
            .returning("*");

          return updateChatPreference;
        }

        const [createChatPreference]: rawchatpreferencetype[] = await db(
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
      { data }: { data: { room: string } },
      { user }: { user: loggedusertype }
    ): Promise<{ room: string }> => {
      try {
        if (!user) throw Error("User not authorized");

        const chatPreferenceFound: chatpreferencetype = await findOne<
          chatpreferencetype,
          { owner: string; room: string }
        >("chat_preferences", { owner: user.id, room: data.room });

        if (!chatPreferenceFound)
          throw Error("Chat not found with settings...");

        const [deleteChatPreference]: { room: string }[] = await db(
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
