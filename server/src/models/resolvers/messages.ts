import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { chatroomtype } from "./types/chatroomtypes.js";
import { filtersorttype, IDSTYPE } from "../../utils/common/types.js";
import { messagetype, messagefiltertype } from "./types/messagetypes.js";

export const messageResolvers = {
  Query: {
    listMessages: async (
      _: undefined,
      filter?: filtersorttype<messagefiltertype>
    ): Promise<messagetype[]> => {
      try {
        const allMessages: messagetype[] = await listAll<
          messagetype,
          messagefiltertype
        >("messages", filter);

        return allMessages;
      } catch (err) {
        throw err;
      }
    },
    message: async (_: undefined, { id }: IDSTYPE): Promise<messagetype> => {
      try {
        const messageById: messagetype = await findOne<messagetype, IDSTYPE>(
          "messages",
          { id }
        );

        if (!messageById) throw new Error(`Message not found with id: ${id}`);

        return messageById;
      } catch (err) {
        throw err;
      }
    },
  },
  Message: {
    user_id: async ({ user_id }: { user_id: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, IDSTYPE>("users", {
          id: user_id,
        });

        return userById;
      } catch (err) {
        throw err;
      }
    },
    room_id: async ({
      room_id,
    }: {
      room_id: string;
    }): Promise<chatroomtype> => {
      try {
        const roomByCode: chatroomtype = await findOne<chatroomtype, IDSTYPE>(
          "chatrooms",
          { id: room_id }
        );

        return roomByCode;
      } catch (err) {
        throw err;
      }
    },
  },
};
