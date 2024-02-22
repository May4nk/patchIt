import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { tagdatatype, remtagdatatype, rtagtype } from "./types/tagmutetypes.js";
import { tagtype } from "../resolvers/types/tagtypes.js";

export const tagMutations = {
  Mutation:{
    upsertTag: async(parent: undefined, { data }: tagdatatype): Promise<tagtype> => {
      try {
        const foundTag: tagtype = await findOne<tagtype, { name: string }>("tags", { "name": data.name });
        
        if(!foundTag){
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
      } catch(err) {
        throw err;
      }
    },
    removeTag: async(parent: undefined, { data }: remtagdatatype): Promise<rtagtype> => {
      try {
        const foundTag: tagtype = await findOne<tagtype, { id: number }>("tags", { "id": data.id });
        
        if(!foundTag) throw new Error("Tag not found...");
        
        const [deleteTag]: rtagtype[] = await db("tags")
          .where("id", foundTag.id)
          .del()
          .returning("id");
        
        return deleteTag;
      } catch(err) {
        throw err;
      }
    }
  }
}
