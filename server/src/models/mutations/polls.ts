import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE, loggedusertype } from "../../utils/common/types.js";
import { polltype, rawpolltype } from "../resolvers/types/polltypes.js";

export const pollsMutations = {
  Mutation: {
    upsertPolls: async (
      _: undefined,
      { data }: { data: rawpolltype },
      { user }: { user: loggedusertype }
    ): Promise<rawpolltype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const foundPollUserReaction: polltype = await findOne<
          polltype,
          { user_id: string; post_id: string }
        >("polls", { user_id: data.user_id, post_id: data.post_id });

        if (foundPollUserReaction) {
          const [updatePollUserReaction]: rawpolltype[] = await db("polls")
            .where("id", foundPollUserReaction.id)
            .update(data)
            .returning("*");

          return updatePollUserReaction;
        }

        const [createPollUserReaction]: rawpolltype[] = await db("polls")
          .insert(data)
          .returning("*");

        return createPollUserReaction;
      } catch (err) {
        throw err;
      }
    },
    removePoll: async (
      _: undefined,
      { data }: { data: rawpolltype }
    ): Promise<IDSTYPE> => {
      try {
        const foundPollUserReaction: polltype = await findOne<
          polltype,
          { user_id: string; post_id: string }
        >("polls", { user_id: data.user_id, post_id: data.post_id });

        if (!foundPollUserReaction) throw new Error("Poll not found...");

        const [deletePoll]: IDSTYPE[] = await db("polls")
          .where("id", foundPollUserReaction.id)
          .del()
          .returning("id");

        return deletePoll;
      } catch (err) {
        throw err;
      }
    },
  },
};
