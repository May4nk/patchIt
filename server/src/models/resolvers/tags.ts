import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { filtersorttype } from "../../utils/common/types.js";
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
    tag: async (_: undefined, { id }: { id: string }): Promise<tagtype> => {
      try {
        const tagById: tagtype = await findOne<tagtype, { id: string }>(
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
