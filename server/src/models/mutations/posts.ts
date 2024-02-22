import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { postdatatype, rempostdatatype, rposttype } from "./types/postmutetypes.js";
import { posttype } from "../resolvers/types/posttypes.js";

export const postMutations = {
  Mutation:{
    upsertPost: async(parent: undefined, { data }: postdatatype, contextValue: any): Promise<posttype> => {
      try {
        if(!contextValue.user) throw new Error("user not authenticated");

        const postID: number = data.id;

        if(postID) {
          const foundPost: posttype = await findOne<posttype, { id: number }>("posts", { "id": postID });

          if(!foundPost) throw new Error(`Post not found...`);
          
          const [updatePost]: posttype[] = await db("posts")
            .where("id", foundPost.id)
            .update(data)
            .returning("id");
         
          return updatePost;
        } else {
          const [createPost]: posttype[] = await db("posts")
            .insert(data)
            .returning("*");

          return createPost;
        }
      } catch(err) {
        throw err;
      }
    },
    removePost: async(parent: undefined, { data }: rempostdatatype): Promise<rposttype> => {
      try {
        const foundPost: posttype = await findOne<posttype, { id: number }>("posts", { "id": data.id });
        
        if(!foundPost) throw new Error("Post not found...");
        
        const [deletePost]: rposttype[] = await db("posts")
          .where("id", data.id)
          .del()
          .returning("id");
        
        return deletePost;
      } catch(err) {
        throw err;
      }
    }
  }
}
