import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";
import { IDSTYPE } from "../../utils/common/types.js";

//types
import { commenttype } from "../resolvers/types/commenttypes.js";
import { usertype } from "../resolvers/types/usertypes.js";

export const commentMutations = {
  Mutation: {
    upsertComment: async (
      _: undefined,
      { data }: { data: commenttype },
      { user, pubsub }: { user: usertype; pubsub: any }
    ): Promise<commenttype> => {
      try {
        if (!user) throw new Error("user not authenticated");
        const commentID: string = data.id;

        if (commentID) {
          const foundComment: commenttype = await findOne<
            commenttype,
            { id: string }
          >("comments", { id: commentID });

          if (!foundComment) throw new Error(`Comment not found...`);

          const [updateComment]: commenttype[] = await db("comments")
            .where("id", foundComment["id"])
            .update({
              ...foundComment,
              ...data,
            })
            .returning("*");

          return updateComment;
        } else {
          const [createComment]: commenttype[] = await db("comments")
            .insert(data)
            .returning("*");

          pubsub.publish("NEWCOMMENT", createComment);

          return createComment;
        }
      } catch (err) {
        throw err;
      }
    },
    removeComment: async (
      _: undefined,
      { data }: { data: IDSTYPE }
    ): Promise<IDSTYPE> => {
      try {
        const foundComment: commenttype = await findOne<
          commenttype,
          { id: string }
        >("comments", { id: data.id });

        if (!foundComment) throw new Error("Comment not found...");

        const [deleteComment]: IDSTYPE[] = await db("comments")
          .where("id", foundComment.id)
          .del()
          .returning("id");

        return deleteComment;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newComment: {
      subscribe: (parent: undefined, _: undefined, { pubsub }: any) => {
        return pubsub.asyncIterator("NEWCOMMENT");
      },
      resolve: (payload: any) => {
        return [payload];
      },
    },
  },
};
