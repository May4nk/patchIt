import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE, loggedusertype } from "../../utils/common/types.js";
import { rawpostlikedislikestype } from "../resolvers/types/postlikedisliketypes.js";

export const postlikedislikeMutations = {
  Mutation: {
    upsertPostLikeDislike: async (
      _: undefined,
      { data }: { data: rawpostlikedislikestype },
      { user }: { user: loggedusertype }
    ): Promise<rawpostlikedislikestype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const foundPostUserReaction: rawpostlikedislikestype = await findOne<
          rawpostlikedislikestype,
          { user_id: string; post_id: string }
        >("post_like_dislikes", {
          user_id: data.user_id,
          post_id: data.post_id,
        });

        if (foundPostUserReaction) {
          const [updatePostUserReaction]: rawpostlikedislikestype[] = await db(
            "post_like_dislikes"
          )
            .where("id", foundPostUserReaction.id)
            .update(data)
            .returning("*");

          return updatePostUserReaction;
        }

        const [createPostUserReaction]: rawpostlikedislikestype[] = await db(
          "post_like_dislikes"
        )
          .insert(data)
          .returning("*");

        return createPostUserReaction;
      } catch (err) {
        throw err;
      }
    },
    removePostLikeDislike: async (
      _: undefined,
      { data }: { data: rawpostlikedislikestype }
    ): Promise<IDSTYPE> => {
      try {
        const foundPostUserReaction: rawpostlikedislikestype = await findOne<
          rawpostlikedislikestype,
          { user_id: string; post_id: string }
        >("post_like_dislikes", {
          user_id: data.user_id,
          post_id: data.post_id,
        });

        if (!foundPostUserReaction)
          throw new Error("Post like/dislike not found...");

        const [deletePostLikeDislike]: IDSTYPE[] = await db(
          "post_like_dislikes"
        )
          .where("id", foundPostUserReaction.id)
          .del()
          .returning("id");

        return deletePostLikeDislike;
      } catch (err) {
        throw err;
      }
    },
  },
};
