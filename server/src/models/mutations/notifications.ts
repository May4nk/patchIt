import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import {
  notificationtype,
  rnotificationtype,
  rawnotificationtype,
} from "../resolvers/types/notificationtypes.js";
import { IDSTYPE, NOTIFYTYPE } from "../../utils/common/types.js";

export const notificationMutations = {
  Mutation: {
    upsertNotification: async (
      _: undefined,
      { data }: { data: rawnotificationtype },
      { pubsub }: any
    ): Promise<rawnotificationtype> => {
      try {
        if (data?.id) {
          const foundNotification: notificationtype = await findOne<
            notificationtype,
            IDSTYPE
          >("notifications", { id: data.id });

          const [updateNotification]: rawnotificationtype[] = await db(
            "notifications"
          )
            .where("id", foundNotification.id)
            .update(data)
            .returning("*");

          pubsub.publish("NEW_NOTIFICATION", updateNotification);

          return updateNotification;
        }

        const [createNotification]: rawnotificationtype[] = await db(
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
    ): Promise<IDSTYPE> => {
      try {
        const foundNotification: notificationtype = await findOne<
          notificationtype,
          { touser: string; fromuser: string }
        >("notifications", { touser: data?.touser, fromuser: data?.fromuser });

        if (!foundNotification) throw new Error("Notification not found...");

        const [deleteNotification]: IDSTYPE[] = await db("notifications")
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
        payload: rawnotificationtype,
        { type, userId }: { type: NOTIFYTYPE; userId: string }
      ) => {
        if (payload.touser === userId && payload.type === type) {
          return [payload];
        }
      },
    },
  },
};
