import { listAll, findOne } from "../../utils/queriesutils.js";

//types
import { filtersorttype } from "../../utils/types.js";
import { tagtype, tagfiltertype } from "./types/tagtypes.js";

export const tagResolvers = {
  Query: {
    listTags: async (
      _: undefined,
      filter: filtersorttype<tagfiltertype>
    ): Promise<tagtype[]> => {
      try {
        const allTags: tagtype[] = await listAll<tagtype, tagfiltertype>(
          "tags",
          filter
        );

        return allTags;
      } catch (err) {
        throw err;
      }
    },
    tag: async (_: undefined, { id }: { id: number }): Promise<tagtype> => {
      try {
        const tagById: tagtype = await findOne<tagtype, { id: number }>(
          "tags",
          { id: id }
        );

        if (!tagById) throw new Error(`tag not found with ID: ${id}`);

        return tagById;
      } catch (err) {
        throw err;
      }
    },
  },
};
