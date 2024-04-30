import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import {
  postlikedislikesdatatype,
  rempostlikedislikesdatatype,
  rpostlikedislikestype,
  postlikedislikestype,
} from "./types/postlikedislikesmutetypes.js";

export const postlikedislikeMutations = {
  Mutation: {
    upsertPostLikeDislike: async (
      parent: undefined,
      { data }: postlikedislikesdatatype,
      contextValue: any
    ): Promise<postlikedislikestype> => {
      try {
        if (!contextValue.user) throw new Error("user not authenticated");

        const foundPostUserReaction: postlikedislikestype = await findOne<
          postlikedislikestype,
          { user_id: number; post_id: number }
        >("post_like_dislikes", { user_id: data.user_id, post_id: data.post_id });

        if (foundPostUserReaction) {
          const [updatePostUserReaction]: postlikedislikestype[] = await db("post_like_dislikes")
            .where("id", foundPostUserReaction.id)
            .update(data)
            .returning("*");

          return updatePostUserReaction;
        }

        const [createPostUserReaction]: postlikedislikestype[] = await db("post_like_dislikes")
          .insert(data)
          .returning("*");

        return createPostUserReaction;
      } catch (err) {
        throw err;
      }
    },
    removePostLikeDislike: async (
      parent: undefined,
      { data }: rempostlikedislikesdatatype
    ): Promise<rpostlikedislikestype> => {
      try {
        const foundPostUserReaction: postlikedislikestype = await findOne<
          postlikedislikestype,
          { user_id: number; post_id: number }
        >("post_like_dislikes", { user_id: data.user_id, post_id: data.post_id });

        if (!foundPostUserReaction)
          throw new Error("Post like/dislike not found...");

        const [deletePostLikeDislike]: rpostlikedislikestype[] = await db("post_like_dislikes")
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
