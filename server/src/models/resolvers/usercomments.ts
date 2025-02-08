import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { filtersorttype } from "../../utils/common/types.js";
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
      { id }: { id: string }
    ): Promise<usercommenttype> => {
      try {
        const userCommnetById: usercommenttype = await findOne<
          usercommenttype,
          { id: string }
        >("user_comment_relation", { id: id });

        if (!userCommnetById) throw new Error(`User not liked this comment`);

        return userCommnetById;
      } catch (err) {
        throw err;
      }
    },
  },
  UserComment: {
    user_id: async ({ user_id }: { user_id: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: string }>(
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
      comment_id: string;
    }): Promise<commenttype> => {
      try {
        const commentById: commenttype = await findOne<
          commenttype,
          { id: string }
        >("comments", { id: comment_id });

        return commentById;
      } catch (err) {
        throw err;
      }
    },
  },
};
