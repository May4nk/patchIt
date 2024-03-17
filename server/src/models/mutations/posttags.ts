import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { posttagdatatype, posttagbatchdatatype, remposttagdatatype, rposttagtype, posttagtype } from "./types/posttagmutetypes.js";

export const posttagMutations = {
  Mutation:{
    batchInsertPostTags: async(parent: undefined, { data }: posttagbatchdatatype): Promise<posttagtype[]> => {
      try {
        const insertBulkPostTags: posttagtype[] = await db.batchInsert("posts_tags_relation", data)
          .returning("*");

        return insertBulkPostTags;
      } catch(err) {
        throw err;
      }    
    },
    removePostTag: async(parent: undefined, { data }: remposttagdatatype): Promise<rposttagtype> => {
      try {
        const foundPostTag: posttagtype = await findOne<posttagtype, { post_id : number, tag_id: number }>("posts_tags_relation", { "post_id": data.post_id, "tag_id": data.tag_id });
        
        if(!foundPostTag) throw new Error("Tag is not associated with post");

        const [deletePostTag]: rposttagtype[] = await db("posts_tags_relation")
          .where("id", foundPostTag.id)
          .del()
          .returning("id");       

        return deletePostTag;
      } catch(err) {
        throw err;
      }
    }
  }
}
