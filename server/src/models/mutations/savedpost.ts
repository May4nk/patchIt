import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { rsavedposttype, savedposttype } from "./types/savedpostmutetypes.js";

export const savedpostMutations = {
  Mutation: {
    upsertSavedPost: async (_: undefined, { data }: { data: savedposttype }): Promise<savedposttype> => {
      try {
        const foundSavedPost: savedposttype = await findOne<
          savedposttype,
          { user_id: number; post_id: number }
        >("saved", { user_id: data.user_id, post_id: data.post_id });

        if (foundSavedPost) {
          const [updateSavedPost]: savedposttype[] = await db("saved")
            .where("id", foundSavedPost.id)
            .update({
              ...data,
            })
            .returning("*");

          return updateSavedPost;
        } else {
          const [createSavedPost]: savedposttype[] = await db("saved")
            .insert({
              post_id: data.post_id,
              user_id: data.user_id,
              pinned: data?.pinned,
              saved: data?.saved,
            })
            .returning("*");

          return createSavedPost;
        }
      } catch (err) {
        throw err;
      }
    },
    removeSavedPost: async (_: undefined, { data }: { data: rsavedposttype }): Promise<rsavedposttype> => {
      try {
        const foundSavedPost: savedposttype = await findOne<
          savedposttype,
          { id: number }
        >("saved", { id: data.id });

        if (!foundSavedPost) throw new Error("Saved post not found...");

        const [deleteSavedPost]: rsavedposttype[] = await db("saved")
          .where("id", foundSavedPost.id)
          .del()
          .returning("id");

        return deleteSavedPost;
      } catch (err) {
        throw err;
      }
    },
  },
};
