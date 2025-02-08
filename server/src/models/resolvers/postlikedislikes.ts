import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";
import { filtersorttype, IDSTYPE } from "../../utils/common/types.js";
import {
  postlikedislikestype,
  rawpostlikedislikestype,
} from "./types/postlikedisliketypes.js";

export const postlikedislikeResolvers = {
  Query: {
    listPostLikeDislikes: async (
      _: undefined,
      filter: filtersorttype<rawpostlikedislikestype>
    ): Promise<postlikedislikestype[]> => {
      try {
        const allLikeDislikes: postlikedislikestype[] = await listAll<
          postlikedislikestype,
          rawpostlikedislikestype
        >("post_like_dislikes", filter);

        return allLikeDislikes;
      } catch (err) {
        throw err;
      }
    },
    postlikedislike: async (
      _: undefined,
      { id }: IDSTYPE
    ): Promise<postlikedislikestype> => {
      try {
        const postlikedislikeById: postlikedislikestype = await findOne<
          postlikedislikestype,
          IDSTYPE
        >("post_like_dislikes", { id });

        if (!postlikedislikeById)
          throw new Error(`like/dislikes not found with id: ${id}`);

        return postlikedislikeById;
      } catch (err) {
        throw err;
      }
    },
  },
  Postlikedislike: {
    post_id: async ({ post_id }: { post_id: string }): Promise<posttype> => {
      try {
        const postById: posttype = await findOne<posttype, IDSTYPE>("posts", {
          id: post_id,
        });

        return postById;
      } catch (err) {
        throw err;
      }
    },
    user_id: async ({ user_id }: { user_id: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, IDSTYPE>("users", {
          id: user_id,
        });

        return userById;
      } catch (err) {
        throw err;
      }
    },
  },
};
