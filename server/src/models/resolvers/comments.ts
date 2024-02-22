import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { commenttype, commentfiltertype } from "./types/commenttypes.js";
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";

export const commentResolvers = {
  Query: {
    listComments: async (parent: undefined, filter: filtersorttype<commentfiltertype> ): Promise<commenttype[]> => {
      try {
        const allcomments: commenttype[] = await listAll<commenttype, commentfiltertype>("comments", filter );
        return allcomments;
      } catch(err) {
        throw err;
      }
    },
    comment: async ( parent: undefined, { id }: { id: number } ): Promise<commenttype> => {
      try {
        const commentById: commenttype = await findOne<commenttype, { id: number }>("comments", { "id" : id });

        if(!commentById) throw new Error(`Comment not found with Id: ${ id }`);

        return commentById;
      } catch(err) {
        throw err;
      }
    }
  },
  Comment: {
    user_id: async({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { "id": user_id });
        return userById;
      } catch (err) {
        throw err;
      }       
    },
    parent_id: async({ parent_id }: { parent_id: number }): Promise<commenttype> => {
      try {
        const parentComment: commenttype = await findOne<commenttype, { id: number }>("comments", { "id": parent_id });
        return parentComment;
      } catch (err) {
        throw err;
      }          
    },
    post_id: async({ post_id }: { post_id: number }): Promise<posttype> => {
      try {
        const commentPost: posttype = await findOne<posttype, { id: number }>("posts", { "id": post_id });
        return commentPost;
      } catch (err) {
        throw err;
      }          
    }   
  }
}

