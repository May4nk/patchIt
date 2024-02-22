import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { tagtype, tagfiltertype } from "./types/tagtypes.js";

export const tagResolvers = {
  Query: {
    listTags: async (parent: undefined, filter: filtersorttype<tagfiltertype>): Promise<tagtype[]> => {
      try {
        const allTags: tagtype[] = await listAll<tagtype, tagfiltertype>("tags", filter);
        return allTags;
      } catch(err) {
        throw err;
      }
    },
    tag: async (parent: undefined, { id }: { id: number }): Promise<tagtype> => {
      try {
        const tagById: tagtype = await findOne<tagtype, { id: number }>("tags", { "id": id }); 

        if(!tagById) throw new Error(`tag not found with ID: ${id}`);

        return tagById;
      } catch(err) {
        throw err;
      }
    }
  }
}

