import { listAll, findOne } from "../../utils/queriesutils.js";

//types
import { filtersorttype } from "../../utils/types.js";
import { commenttype } from "./types/commenttypes.js";
import { usertype } from "./types/usertypes.js";
import {
  usercommenttype,
  usercommentfiltertype,
} from "./types/usercommenttypes.js";

export const usercommentResolvers = {
  Query: {
    listUserCommentLikes: async (
      _: undefined,
      filter: filtersorttype<usercommentfiltertype>
    ): Promise<usercommenttype[]> => {
      try {
        const allUserComments: usercommenttype[] = await listAll<
          usercommenttype,
          usercommentfiltertype
        >("user_comment_relation", filter);

        return allUserComments;
      } catch (err) {
        throw err;
      }
    },
    userCommentLike: async (
      _: undefined,
      { id }: { id: number }
    ): Promise<usercommenttype> => {
      try {
        const userCommnetById: usercommenttype = await findOne<
          usercommenttype,
          { id: number }
        >("user_comment_relation", { id: id });

        if (!userCommnetById) throw new Error(`User not liked this comment`);

        return userCommnetById;
      } catch (err) {
        throw err;
      }
    },
  },
  UserComment: {
    user_id: async ({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>(
          "users",
          { id: user_id }
        );

        return userById;
      } catch (err) {
        throw err;
      }
    },
    comment_id: async ({
      comment_id,
    }: {
      comment_id: number;
    }): Promise<commenttype> => {
      try {
        const commentById: commenttype = await findOne<
          commenttype,
          { id: number }
        >("comments", { id: comment_id });

        return commentById;
      } catch (err) {
        throw err;
      }
    },
  },
};
