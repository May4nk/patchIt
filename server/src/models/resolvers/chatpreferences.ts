import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype, IDSTYPE } from "../../utils/common/types.js";
import { chatroomtype } from "./types/chatroomtypes.js";
import {
  chatpreferencetype,
  chatpreferencefiltertype,
} from "./types/chatpreferencetypes.js";

export const chatpreferenceResolvers = {
  Query: {
    listChatPreferences: async (
      _: undefined,
      filter?: filtersorttype<chatpreferencefiltertype>
    ): Promise<chatpreferencetype[]> => {
      try {
        const allchatpreferences: chatpreferencetype[] = await listAll<
          chatpreferencetype,
          chatpreferencefiltertype
        >("chat_preferences", filter);

        return allchatpreferences;
      } catch (err) {
        throw err;
      }
    },
    chatpreference: async (
      _: undefined,
      { chatroomId }: { chatroomId: string }
    ): Promise<chatpreferencetype> => {
      try {
        const chatpreferenceByChatroom: chatpreferencetype = await findOne<
          chatpreferencetype,
          { room: string }
        >("chat_preferences", { room: chatroomId });

        if (!chatpreferenceByChatroom)
          throw new Error(
            `No setting found for Chatroom with Id: ${chatroomId}`
          );

        return chatpreferenceByChatroom;
      } catch (err) {
        throw err;
      }
    },
  },
  ChatPreferences: {
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
    room: async ({ room }: { room: string }): Promise<chatroomtype> => {
      try {
        const chatroomByRoomcode: chatroomtype = await findOne<
          chatroomtype,
          IDSTYPE
        >("chatrooms", { id: room });

        return chatroomByRoomcode;
      } catch (err) {
        throw err;
      }
    },
    admin: async ({ admin }: { admin: string }): Promise<usertype | null> => {
      try {
        if (admin) {
          const userByUsername: usertype = await findOne<
            usertype,
            { username: string }
          >("users", { username: admin });

          return userByUsername;
        }

        return null;
      } catch (err) {
        throw err;
      }
    },
    co_admin: async ({
      co_admin,
    }: {
      co_admin: string;
    }): Promise<usertype | null> => {
      try {
        if (co_admin) {
          const userByUsername: usertype = await findOne<
            usertype,
            { username: string }
          >("users", { username: co_admin });

          return userByUsername;
        }

        return null;
      } catch (err) {
        throw err;
      }
    },
    acceptor: async ({
      acceptor,
    }: {
      acceptor: string;
    }): Promise<usertype | null> => {
      try {
        if (acceptor) {
          const userByUsername: usertype = await findOne<
            usertype,
            { username: string }
          >("users", { username: acceptor });

          return userByUsername;
        }

        return null;
      } catch (err) {
        throw err;
      }
    },
    operator: async ({
      operator,
    }: {
      operator: string;
    }): Promise<usertype | null> => {
      try {
        if (operator) {
          const userByUsername: usertype = await findOne<
            usertype,
            { username: string }
          >("users", { username: operator });

          return userByUsername;
        }

        return null;
      } catch (err) {
        throw err;
      }
    },
  },
};
