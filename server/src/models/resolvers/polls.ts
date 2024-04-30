import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { polltype, pollfiltertype } from "./types/polltypes.js";
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";

export const pollResolvers = {
  Query: {
    listPolls: async (parent: undefined, filter: filtersorttype<pollfiltertype>): Promise<polltype[]> => {
      try {
        const allPolls: polltype[] = await listAll<polltype, pollfiltertype>("polls", filter);
        return allPolls;
      } catch(err) {
        throw err;
      }
    },
    poll: async (parent: undefined, { id }: { id: number }): Promise<polltype> => {
      try {
        const pollById: polltype = await findOne<polltype, { id: number }>("polls", { "id": id }); 

        if(!pollById) throw new Error(`No poll found with id: ${id}`);

        return pollById;
      } catch(err) {
        throw err;
      }
    }   
  },
  Poll: {
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

