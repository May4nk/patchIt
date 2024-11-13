import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "../resolvers/types/usertypes.js";
import {
  postlikedislikesdatatype,
  rempostlikedislikesdatatype,
  rpostlikedislikestype,
  postlikedislikestype,
} from "./types/postlikedislikesmutetypes.js";

export const postlikedislikeMutations = {
  Mutation: {
    upsertPostLikeDislike: async (
      _: undefined,
      { data }: postlikedislikesdatatype,
      { user }: { user: usertype }
    ): Promise<postlikedislikestype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const foundPostUserReaction: postlikedislikestype = await findOne<
          postlikedislikestype,
          { user_id: number; post_id: number }
        >("post_like_dislikes", {
          user_id: data.user_id,
          post_id: data.post_id,
        });

        if (foundPostUserReaction) {
          const [updatePostUserReaction]: postlikedislikestype[] = await db(
            "post_like_dislikes"
          )
            .where("id", foundPostUserReaction.id)
            .update(data)
            .returning("*");

          return updatePostUserReaction;
        }

        const [createPostUserReaction]: postlikedislikestype[] = await db(
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
      { data }: rempostlikedislikesdatatype
    ): Promise<rpostlikedislikestype> => {
      try {
        const foundPostUserReaction: postlikedislikestype = await findOne<
          postlikedislikestype,
          { user_id: number; post_id: number }
        >("post_like_dislikes", {
          user_id: data.user_id,
          post_id: data.post_id,
        });

        if (!foundPostUserReaction)
          throw new Error("Post like/dislike not found...");

        const [deletePostLikeDislike]: rpostlikedislikestype[] = await db(
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
