import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { tagtype } from "../resolvers/types/tagtypes.js";
interface rtagtype {
  id: number;
}

export const tagMutations = {
  Mutation: {
    upsertTag: async (
      parent: undefined,
      { data }: { data: tagtype }
    ): Promise<tagtype> => {
      try {
        const foundTag: tagtype = await findOne<tagtype, { name: string }>(
          "tags",
          { name: data.name }
        );

        if (!foundTag) {
          const [createTag]: tagtype[] = await db("tags")
            .insert(data)
            .returning("*");

          return createTag;
        }

        const [updateTag]: tagtype[] = await db("tags")
          .where("id", foundTag.id)
          .update(data)
          .returning("*");

        return updateTag;
      } catch (err) {
        throw err;
      }
    },
    removeTag: async (
      parent: undefined,
      { data }: { data: rtagtype }
    ): Promise<rtagtype> => {
      try {
        const foundTag: tagtype = await findOne<tagtype, { id: number }>(
          "tags",
          { id: data.id }
        );

        if (!foundTag) throw new Error("Tag not found...");

        const [deleteTag]: rtagtype[] = await db("tags")
          .where("id", foundTag.id)
          .del()
          .returning("id");

        return deleteTag;
      } catch (err) {
        throw err;
      }
    },
  },
};
