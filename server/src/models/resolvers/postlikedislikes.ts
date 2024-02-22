import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { postlikedislikestype, postlikedislikesfiltertype } from "./types/postlikedisliketypes.js";
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";


export const postlikedislikeResolvers = {
  Query: {
    listPostLikeDislikes: async (parent: undefined, filter: filtersorttype<postlikedislikesfiltertype>): Promise<postlikedislikestype[]> => {
      try {
        const allLikeDislikes: postlikedislikestype[] = await listAll<postlikedislikestype, postlikedislikesfiltertype>("post_like_dislikes", filter);
        return allLikeDislikes;
      } catch(err) {
        throw err;
      }
    },
    postlikedislike: async (parent: undefined, { id }: { id: number }): Promise<postlikedislikestype> => {
      try {
        const postlikedislikeById: postlikedislikestype = await findOne<postlikedislikestype, { id: number }>("post_like_dislikes", { "id": id }); 

        if(!postlikedislikeById) throw new Error(`like/dislikes not found with id: ${id}`);

        return postlikedislikeById;
      } catch(err) {
        throw err;
      }
    }   
  },
  Postlikedislike: {
    post_id: async({ post_id }: { post_id: number }): Promise<posttype> => {
      try {
        const postById: posttype = await findOne<posttype, { id: number }>("posts", { "id": post_id });
        return postById;
      } catch (err) {
        throw err;
      }
    },
    user_id: async({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { "id": user_id });
        return userById;
      } catch (err) {
        throw err;
      }
    },
  }
}

