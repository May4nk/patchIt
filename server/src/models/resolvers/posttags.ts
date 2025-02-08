import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { tagtype } from "./types/tagtypes.js";
import { posttype } from "./types/posttypes.js";
import { filtersorttype } from "../../utils/common/types.js";
import { posttagtype, rawposttagtype } from "./types/posttagstypes.js";

export const posttagsResolvers = {
  Query: {
    listPostTags: async (
      _: undefined,
      filter: filtersorttype<rawposttagtype>
    ): Promise<posttagtype[]> => {
      try {
        const allPostTags: posttagtype[] = await listAll<
          posttagtype,
          rawposttagtype
        >("posts_tags_relation", filter);

        return allPostTags;
      } catch (err) {
        throw err;
      }
    },
    postTag: async (
      _: undefined,
      { id }: { id: string }
    ): Promise<posttagtype> => {
      try {
        const postTagById: posttagtype = await findOne<
          posttagtype,
          { id: string }
        >("posts_tags_relation", { id });

        if (!postTagById)
          throw new Error(`Post and tag relation not found with id: ${id}`);

        return postTagById;
      } catch (err) {
        throw err;
      }
    },
  },
  PostTags: {
    tag_id: async ({ tag_id }: { tag_id: string }): Promise<tagtype> => {
      try {
        const tagById: tagtype = await findOne<tagtype, { id: string }>(
          "tags",
          { id: tag_id }
        );
        return tagById;
      } catch (err) {
        throw err;
      }
    },
    post_id: async ({ post_id }: { post_id: string }): Promise<posttype> => {
      try {
        const postById: posttype = await findOne<posttype, { id: string }>(
          "posts",
          { id: post_id }
        );
        return postById;
      } catch (err) {
        throw err;
      }
    },
  },
};
