import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import {
  NOTIFICATIONTYPE,
  notificationtype,
  rnotificationtype,
} from "./types/notificationmutetypes.js";

export const notificationMutations = {
  Mutation: {
    upsertNotification: async (
      _: undefined,
      { data }: { data: notificationtype },
      { pubsub }: any
    ): Promise<notificationtype> => {
      try {
        if (data?.id) {
          const foundNotification: notificationtype = await findOne<
            notificationtype,
            { id: number }
          >("notifications", { id: data.id });

          const [updateNotification]: notificationtype[] = await db(
            "notifications"
          )
            .where("id", foundNotification.id)
            .update(data)
            .returning("*");

          pubsub.publish("NEW_NOTIFICATION", updateNotification);

          return updateNotification;
        }

        const [createNotification]: notificationtype[] = await db(
          "notifications"
        )
          .insert(data)
          .returning("*");

        pubsub.publish("NEW_NOTIFICATION", createNotification);

        return createNotification;
      } catch (err) {
        throw err;
      }
    },
    removeNotification: async (
      _: undefined,
      { data }: { data: rnotificationtype }
    ): Promise<rnotificationtype> => {
      try {
        const foundNotification: notificationtype = await findOne<
          notificationtype,
          { touser: number; fromuser: number }
        >("notifications", { touser: data?.touser, fromuser: data?.fromuser });

        if (!foundNotification) throw new Error("Notification not found...");

        const [deleteNotification]: rnotificationtype[] = await db(
          "notifications"
        )
          .where("id", foundNotification.id)
          .del()
          .returning("id");

        return deleteNotification;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newNotification: {
      subscribe: (_: undefined, args: undefined, { pubsub }: any) => {
        return pubsub.asyncIterator(["NEW_NOTIFICATION"]);
      },
      resolve: (
        payload: notificationtype,
        { type, userId }: { type: NOTIFICATIONTYPE; userId: number }
      ) => {
        if (payload.touser === userId && payload.type === type) {
          return [payload];
        }
      },
    },
  },
};
