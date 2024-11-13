import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "../resolvers/types/usertypes.js";
interface usercommenttype {
  id: number;
  comment_id: number;
  user_id: number;
}

type rusercommenttype = {
  id: number;
};

export const usercommentMutations = {
  Mutation: {
    insertUserCommentLike: async (
      _: undefined,
      { data }: { data: usercommenttype },
      { user }: { user: usertype }
    ): Promise<usercommenttype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const foundUserCommentLike: usercommenttype = await findOne<
          usercommenttype,
          { user_id: number; comment_id: number }
        >("user_comment_relation", {
          user_id: data.user_id,
          comment_id: data.comment_id,
        });

        if (foundUserCommentLike) {
          const [deleteUserCommentLike]: usercommenttype[] = await db(
            "user_comment_relation"
          )
            .where("id", foundUserCommentLike.id)
            .del()
            .returning("*");

          return deleteUserCommentLike;
        }

        const [createUserCommentLike]: usercommenttype[] = await db(
          "user_comment_relation"
        )
          .insert(data)
          .returning("*");

        return createUserCommentLike;
      } catch (err) {
        throw err;
      }
    },
    removeUserCommentLike: async (
      _: undefined,
      { data }: { data: usercommenttype }
    ): Promise<rusercommenttype> => {
      try {
        const foundUserCommentLike: usercommenttype = await findOne<
          usercommenttype,
          { user_id: number; comment_id: number }
        >("user_comment_relation", {
          user_id: data.user_id,
          comment_id: data.comment_id,
        });

        if (!foundUserCommentLike)
          throw new Error("User didn't liked this comment yet.");

        const [deleteUserCommentLike]: rusercommenttype[] = await db(
          "user_comment_relation"
        )
          .where("id", foundUserCommentLike.id)
          .del()
          .returning("id");

        return deleteUserCommentLike;
      } catch (err) {
        throw err;
      }
    },
  },
};
