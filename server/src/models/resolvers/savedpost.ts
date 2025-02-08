import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";
import { filtersorttype, IDSTYPE } from "../../utils/common/types.js";
import { rawsavedposttype, savedposttype } from "./types/savedposttypes.js";

export const savedpostResolvers = {
  Query: {
    listSavedPost: async (
      _: undefined,
      filter: filtersorttype<rawsavedposttype>
    ): Promise<savedposttype[]> => {
      try {
        const allSavedPost: savedposttype[] = await listAll<
          savedposttype,
          rawsavedposttype
        >("saved", filter);

        return allSavedPost;
      } catch (err) {
        throw err;
      }
    },
    savedPost: async (
      _: undefined,
      { id }: IDSTYPE
    ): Promise<savedposttype> => {
      try {
        const savedPost: savedposttype = await findOne<savedposttype, IDSTYPE>(
          "saved",
          { id }
        );

        if (!savedPost) throw new Error(`Saved Post not found with Id: ${id}`);

        return savedPost;
      } catch (err) {
        throw err;
      }
    },
  },
  SavedPost: {
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
  },
};
