import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE, loggedusertype } from "../../utils/common/types.js";
import {
  rawusercommenttype,
  usercommenttype,
} from "../resolvers/types/usercommenttypes.js";

export const usercommentMutations = {
  Mutation: {
    insertUserCommentLike: async (
      _: undefined,
      { data }: { data: rawusercommenttype },
      { user }: { user: loggedusertype }
    ): Promise<rawusercommenttype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const foundUserCommentLike: usercommenttype = await findOne<
          usercommenttype,
          { user_id: string; comment_id: string }
        >("user_comment_relation", {
          user_id: data.user_id,
          comment_id: data.comment_id,
        });

        if (foundUserCommentLike) {
          const [deleteUserCommentLike]: rawusercommenttype[] = await db(
            "user_comment_relation"
          )
            .where("id", foundUserCommentLike.id)
            .del()
            .returning("*");

          return deleteUserCommentLike;
        }

        const [createUserCommentLike]: rawusercommenttype[] = await db(
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
      { data }: { data: rawusercommenttype }
    ): Promise<IDSTYPE> => {
      try {
        const foundUserCommentLike: usercommenttype = await findOne<
          usercommenttype,
          { user_id: string; comment_id: string }
        >("user_comment_relation", {
          user_id: data.user_id,
          comment_id: data.comment_id,
        });

        if (!foundUserCommentLike)
          throw new Error("User didn't liked this comment yet.");

        const [deleteUserCommentLike]: IDSTYPE[] = await db(
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
