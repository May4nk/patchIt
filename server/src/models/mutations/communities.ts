import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "../resolvers/types/usertypes.js";
import { communitytype } from "../resolvers/types/communitiestypes.js";
type rcommunitytype = { id: number };

export const communityMutations = {
  Mutation: {
    upsertCommunity: async (
      _: undefined,
      { data }: { data: communitytype },
      { user }: { user: usertype }
    ): Promise<communitytype> => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        const foundCommunity: communitytype = await findOne<
          communitytype,
          { communityname: string }
        >("communities", { communityname: data.communityname });

        if (!foundCommunity) {
          const [createCommunity]: communitytype[] = await db("communities")
            .insert(data)
            .returning("*");

          return createCommunity;
        } else if (foundCommunity && user.id === foundCommunity.owner) {
          const [updateCommunity]: communitytype[] = await db("communities")
            .where("id", foundCommunity["id"])
            .update(data)
            .returning("*");

          return updateCommunity;
        } else {
          throw new Error("Changes not done by superuser");
        }
      } catch (err) {
        throw err;
      }
    },
    removeCommunity: async (
      _: undefined,
      { data }: { data: rcommunitytype }
    ): Promise<rcommunitytype> => {
      try {
        const foundCommunity: communitytype = await findOne<
          communitytype,
          { id: number }
        >("communities", { id: data.id });

        if (!foundCommunity) throw new Error("Community not found...");

        const [deleteCommunity]: rcommunitytype[] = await db("communities")
          .where("id", data.id)
          .del()
          .returning("id");

        return deleteCommunity;
      } catch (err) {
        throw err;
      }
    },
  },
};
