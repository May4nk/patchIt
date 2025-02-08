import { listAll, findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";
import { filtersorttype, IDSTYPE } from "../../utils/common/types.js";
import { polltype, rawpolltype } from "./types/polltypes.js";

export const pollResolvers = {
  Query: {
    listPolls: async (
      _: undefined,
      filter: filtersorttype<rawpolltype>
    ): Promise<polltype[]> => {
      try {
        const allPolls: polltype[] = await listAll<polltype, rawpolltype>(
          "polls",
          filter
        );

        return allPolls;
      } catch (err) {
        throw err;
      }
    },
    poll: async (_: undefined, { id }: IDSTYPE): Promise<polltype> => {
      try {
        const pollById: polltype = await findOne<polltype, IDSTYPE>("polls", {
          id,
        });

        if (!pollById) throw new Error(`No poll found with id: ${id}`);

        return pollById;
      } catch (err) {
        throw err;
      }
    },
  },
  Poll: {
    post_id: async ({ post_id }: { post_id: string }): Promise<posttype> => {
      try {
        const postById: posttype = await findOne<posttype, IDSTYPE>("posts", {
          id: post_id,
        });

        return postById;
      } catch (err) {
        throw err;
      }
    },
    user_id: async ({ user_id }: { user_id: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, IDSTYPE>("users", {
          id: user_id,
        });

        return userById;
      } catch (err) {
        throw err;
      }
    },
  },
};
