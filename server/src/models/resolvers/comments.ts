import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";
import { filtersorttype } from "../../utils/common/types.js";
import { commenttype, commentfiltertype } from "./types/commenttypes.js";

export const commentResolvers = {
  Query: {
    listComments: async (
      _: undefined,
      filter: filtersorttype<commentfiltertype>
    ): Promise<commenttype[]> => {
      try {
        const allcomments: commenttype[] = await listAll<
          commenttype,
          commentfiltertype
        >("comments", filter);

        return allcomments;
      } catch (err) {
        throw err;
      }
    },
    comment: async (
      _: undefined,
      { id }: { id: string }
    ): Promise<commenttype> => {
      try {
        const commentById: commenttype = await findOne<
          commenttype,
          { id: string }
        >("comments", { id: id });

        if (!commentById) throw new Error(`Comment not found with Id: ${id}`);

        return commentById;
      } catch (err) {
        throw err;
      }
    },
  },
  Comment: {
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
    parent_id: async ({
      parent_id,
    }: {
      parent_id: string;
    }): Promise<commenttype> => {
      try {
        const parentComment: commenttype = await findOne<
          commenttype,
          { id: string }
        >("comments", { id: parent_id });

        return parentComment;
      } catch (err) {
        throw err;
      }
    },
    post_id: async ({ post_id }: { post_id: string }): Promise<posttype> => {
      try {
        const commentPost: posttype = await findOne<posttype, { id: string }>(
          "posts",
          { id: post_id }
        );

        return commentPost;
      } catch (err) {
        throw err;
      }
    },
  },
};
