import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { savedpostfiltertype, savedposttype } from "./types/savedposttypes.js";
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";

export const savedpostResolvers = {
  Query: {
    listSavedPost: async (parent: undefined, filter: filtersorttype<savedpostfiltertype>): Promise<savedposttype[]> => {
      try {
        const allSavedPost: savedposttype[] = await listAll<savedposttype, savedpostfiltertype>("saved", filter);
        return allSavedPost;
      } catch(err) {
        throw err;
      }
    },
    savedPost: async (parent: undefined, { id }: { id: number }): Promise<savedposttype> => {
      try {
        const savedPost: savedposttype = await findOne<savedposttype, { id: number }>("saved", { "id": id });
        if(!savedPost) throw new Error(`Saved Post not found with Id: ${ id }`);
        return savedPost;
      } catch(err) {
        throw err;
      }
    }
  },
  SavedPost: {
    user_id: async ({ user_id }: { user_id: number } ): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { "id": user_id });
        return userById;
      } catch(err) {
        throw err;
      }
    },
    post_id: async ({ post_id }: { post_id: number }): Promise<posttype> => {
      try {
        const postById: posttype = await findOne<posttype, { id: number }>("posts", { "id": post_id });
        return postById;
      } catch(err) {
        throw err;
      }
    }
  }
}

