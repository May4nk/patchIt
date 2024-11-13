import { listAll, findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype } from "../../utils/types.js";
import {
  notificationtype,
  notificationfiltertype,
} from "./types/notificationtypes.js";

export const notificationResolvers = {
  Query: {
    listNotifications: async (
      _: undefined,
      filter: filtersorttype<notificationfiltertype>
    ): Promise<notificationtype[]> => {
      try {
        const allNotifications: notificationtype[] = await listAll<
          notificationtype,
          notificationfiltertype
        >("notifications", filter);

        return allNotifications;
      } catch (err) {
        throw err;
      }
    },
    notification: async (
      _: undefined,
      { id }: { id: number }
    ): Promise<notificationtype> => {
      try {
        const notificaitonById: notificationtype = await findOne<
          notificationtype,
          { id: number }
        >("notifications", { id: id });

        if (!notificaitonById) throw new Error(`${id} notification not found`);

        return notificaitonById;
      } catch (err) {
        throw err;
      }
    },
  },
  Notification: {
    touser: async ({ touser }: { touser: number }): Promise<usertype> => {
      const userById: usertype = await findOne<usertype, { id: number }>(
        "users",
        { id: touser }
      );

      return userById;
    },
    fromuser: async ({ fromuser }: { fromuser: number }): Promise<usertype> => {
      const userById: usertype = await findOne<usertype, { id: number }>(
        "users",
        { id: fromuser }
      );

      return userById;
    },
  },
};
