import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import {
  polldatatype,
  rempolldatatype,
  rpolltype,
  polltype,
} from "./types/pollmutetypes.js";
import { usertype } from "../resolvers/types/usertypes.js";

export const pollsMutations = {
  Mutation: {
    upsertPolls: async (
      _: undefined,
      { data }: polldatatype,
      { user }: { user: usertype }
    ): Promise<polltype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const foundPollUserReaction: polltype = await findOne<
          polltype,
          { user_id: number; post_id: number }
        >("polls", { user_id: data.user_id, post_id: data.post_id });

        if (foundPollUserReaction) {
          const [updatePollUserReaction]: polltype[] = await db("polls")
            .where("id", foundPollUserReaction.id)
            .update(data)
            .returning("*");

          return updatePollUserReaction;
        }

        const [createPollUserReaction]: polltype[] = await db("polls")
          .insert(data)
          .returning("*");

        return createPollUserReaction;
      } catch (err) {
        throw err;
      }
    },
    removePoll: async (
      _: undefined,
      { data }: rempolldatatype
    ): Promise<rpolltype> => {
      try {
        const foundPollUserReaction: polltype = await findOne<
          polltype,
          { user_id: number; post_id: number }
        >("polls", { user_id: data.user_id, post_id: data.post_id });

        if (!foundPollUserReaction) throw new Error("Poll not found...");

        const [deletePoll]: rpolltype[] = await db("polls")
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
