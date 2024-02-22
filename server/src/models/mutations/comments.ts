import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { commenttype } from "../resolvers/types/commenttypes.js";
import { commentdatatype, remcommentdatatype, rcommenttype } from "./types/commentmutetypes.js";
import { usertype } from "../resolvers/types/usertypes.js";

export const commentMutations = {
  Mutation:{
    upsertComment: async(parent: undefined, { data }: commentdatatype,  { user, pubsub }: any ): Promise<commenttype> => {
      try {

        if(!user) throw new Error("user not authenticated");
        const commentID: number = data.id;
        if(commentID) {

          const foundComment: commenttype = await findOne<commenttype, { id: number }>("comments", { "id": commentID });
          if(!foundComment) throw new Error(`Comment not found...`);
          
          const [updateComment]: commenttype[] = await db("comments")
            .where("id", foundComment["id"])
            .update({
              comment: data.comment  
            })
            .returning("*");
         
          return updateComment;
        } else {
          const [createComment]: commenttype[] = await db("comments")
            .insert(data)
            .returning("*");

          pubsub.publish("NEWCOMMENT", createComment);

          return createComment;
        }
      } catch(err) {
        throw err;
      }
    },
    removeComment: async(parent: undefined, { data }: remcommentdatatype ): Promise<rcommenttype> => {
      try {
        const foundComment: commenttype = await findOne<commenttype, { id: number }>("comments", { "id": data.id });
        
        if(!foundComment) throw new Error("Comment not found...");
        
        const [deleteComment]: rcommenttype[] = await db("comments")
          .where("id", foundComment.id)
          .del()
          .returning("id");
        
        return deleteComment;
      } catch(err) {
        throw err;
      }
    }
  },
  Subscription: {
    newComment: {
      subscribe: (parent: undefined, args: undefined, { pubsub }: any) => {
        return pubsub.asyncIterator('NEWCOMMENT');
      },
      resolve: (payload: any) => {
        return [payload];
      },      
    }
  }
}
