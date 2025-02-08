import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE } from "../../utils/common/types.js";
import { rawsavedposttype } from "../resolvers/types/savedposttypes.js";

export const savedpostMutations = {
  Mutation: {
    upsertSavedPost: async (
      _: undefined,
      { data }: { data: rawsavedposttype }
    ): Promise<rawsavedposttype> => {
      try {
        const foundSavedPost: rawsavedposttype = await findOne<
          rawsavedposttype,
          { user_id: string; post_id: string }
        >("saved", { user_id: data.user_id, post_id: data.post_id });

        if (foundSavedPost) {
          const [updateSavedPost]: rawsavedposttype[] = await db("saved")
            .where("id", foundSavedPost.id)
            .update(data)
            .returning("*");

          return updateSavedPost;
        } else {
          const [createSavedPost]: rawsavedposttype[] = await db("saved")
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
    removeSavedPost: async (
      _: undefined,
      { data }: { data: IDSTYPE }
    ): Promise<IDSTYPE> => {
      try {
        const foundSavedPost: rawsavedposttype = await findOne<
          rawsavedposttype,
          IDSTYPE
        >("saved", { id: data.id });

        if (!foundSavedPost) throw new Error("Saved post not found...");

        const [deleteSavedPost]: IDSTYPE[] = await db("saved")
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
