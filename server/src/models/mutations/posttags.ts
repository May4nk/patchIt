import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE } from "../../utils/common/types.js";
import { rawposttagtype } from "../resolvers/types/posttagstypes.js";

export const posttagMutations = {
  Mutation: {
    batchInsertPostTags: async (
      _: undefined,
      { data }: { data: rawposttagtype[] }
    ): Promise<rawposttagtype[]> => {
      try {
        const insertBulkPostTags: rawposttagtype[] = await db
          .batchInsert("posts_tags_relation", data)
          .returning("*");

        return insertBulkPostTags;
      } catch (err) {
        throw err;
      }
    },
    removePostTag: async (
      _: undefined,
      { data }: { data: rawposttagtype }
    ): Promise<IDSTYPE> => {
      try {
        const foundPostTag: rawposttagtype = await findOne<
          rawposttagtype,
          { post_id: string; tag_id: string }
        >("posts_tags_relation", {
          post_id: data.post_id,
          tag_id: data.tag_id,
        });

        if (!foundPostTag) throw new Error("Tag is not associated with post");

        const [deletePostTag]: IDSTYPE[] = await db("posts_tags_relation")
          .where("id", foundPostTag.id)
          .del()
          .returning("id");

        return deletePostTag;
      } catch (err) {
        throw err;
      }
    },
  },
};
