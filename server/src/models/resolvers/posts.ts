import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { commenttype } from "./types/commenttypes.js";
import { filtersorttype, IDSTYPE } from "../../utils/common/types.js";
import { posttagtype } from "./types/posttagstypes.js";
import { communitytype } from "./types/communitiestypes.js";
import { posttype, postfiltertype } from "./types/posttypes.js";

export const postResolvers = {
  Query: {
    listPosts: async (
      _: undefined,
      filter: filtersorttype<postfiltertype>
    ): Promise<posttype[]> => {
      try {
        const allPosts: posttype[] = await listAll<posttype, postfiltertype>(
          "posts",
          filter
        );

        return allPosts;
      } catch (err) {
        throw err;
      }
    },
    post: async (_: undefined, { id }: IDSTYPE): Promise<posttype> => {
      try {
        const postById: posttype = await findOne<posttype, IDSTYPE>("posts", {
          id,
        });

        if (!postById) throw new Error(`Post not found with id: ${id}`);

        return postById;
      } catch (err) {
        throw err;
      }
    },
  },
  Post: {
    owner: async ({ owner }: { owner: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, IDSTYPE>("users", {
          id: owner,
        });

        return userById;
      } catch (err) {
        throw err;
      }
    },
    community_id: async ({
      community_id,
    }: {
      community_id: string;
    }): Promise<communitytype> => {
      try {
        const postsCommunity: communitytype = await findOne<
          communitytype,
          IDSTYPE
        >("communities", { id: community_id });

        return postsCommunity;
      } catch (err) {
        throw err;
      }
    },
    tags: async ({ id }: IDSTYPE): Promise<posttagtype[]> => {
      try {
        const postTags: posttagtype[] = await listAll<
          posttagtype,
          { post_id: string }
        >("posts_tags_relation", { filter: { post_id: id } });

        return postTags;
      } catch (err) {
        throw err;
      }
    },
    comments: async ({ id }: IDSTYPE): Promise<commenttype[]> => {
      try {
        const postComments: commenttype[] = await listAll<
          commenttype,
          { post_id: string }
        >("comments", { filter: { post_id: id } });

        return postComments;
      } catch (err) {
        throw err;
      }
    },
  },
};
